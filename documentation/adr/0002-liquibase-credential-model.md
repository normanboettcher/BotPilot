# ADR 0002 — Credential Model for Liquibase and Runtime Database Access

**Status:** Accepted as direction — partially implemented (see status table)

## Context

The runtime datasource uses **dynamic Vault credentials**
(`database/creds/bot-pilot-core-db-role`, injected into `spring.datasource.*` by Spring
Cloud Vault — see [vault-architecture.md](../vault-architecture.md)). Liquibase
([ADR 0001](0001-liquibase-schema-management.md)) needs DDL, the application at runtime
does not. A dedicated **static** Liquibase user is delivered by Vault KV as
`spring.liquibase.url/user/password` via the profile-keyed config import.

## Decision

Adopt a **two-identity model with least privilege**, in this priority order:

1. **Tighten the runtime role to DML-only** (`GRANT SELECT, INSERT, UPDATE, DELETE`
   instead of `ALL PRIVILEGES`). This is the load-bearing control: without it, any
   holder
   of runtime credentials can run DDL and the Liquibase separation is cosmetic.
2. **Liquibase keeps its own DDL-capable credential path**, never shared with runtime.
3. **Migrate the Liquibase credential from static KV to a dynamic Vault database role**
   (`bot-pilot-core-liquibase-role`) — removing the last long-lived DB credential.

### Planned dynamic Liquibase wiring

Vault role (server-side):

```bash
vault write database/roles/bot-pilot-core-liquibase-role \
  db_name=<connection> \
  creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}'; \
    GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES \
    ON <core_db>.* TO '{{name}}'@'%';" \
  default_ttl=1h max_ttl=2h
```

Spring wiring (goes in `application-dev.yml`; Spring Cloud Vault supports multiple
database backends via the plural `spring.cloud.vault.databases.*` map):

```yaml
spring:
  cloud:
    vault:
      databases:
        liquibase:
          enabled: true
          role: bot-pilot-core-liquibase-role
          backend: database
          username-property: spring.liquibase.user
          password-property: spring.liquibase.password
  liquibase:
    url: ${spring.datasource.url}   # URL stays static; only credentials are dynamic
```

## Rationale

- The database secrets engine and Spring Cloud Vault are already in place — dynamic
  Liquibase credentials cost one Vault role plus ~8 lines of YAML.
- **Lease lifecycle is a non-issue for a one-shot startup migration**: `SpringLiquibase`
  runs seconds after the lease is issued; renewal is irrelevant; Vault dropping the
  ephemeral user at TTL expiry is desired behaviour. Only rule: `default_ttl` must
  exceed
  the longest migration.
- **MariaDB-specific safety**: privileges are grant-based at schema level, not
  object-ownership-based. Each run's ephemeral user has identical grants on
  `DATABASECHANGELOG`/`DATABASECHANGELOGLOCK` regardless of which past user created
  them.
  (On PostgreSQL, table ownership follows the creating role — this pattern would need
  extra work there. Do not copy this ADR to a PostgreSQL service unmodified.)
- Composes cleanly with a future decoupled migration step: a CI job would fetch
  credentials itself via `vault read database/creds/bot-pilot-core-liquibase-role`.

## Alternatives considered

| Alternative                                               | Assessment                                                                                                                 |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Keep static Liquibase user in KV (current)                | Correct shape, but a long-lived DDL credential; acceptable interim state                                                   |
| Vault static role with rotation (`database/static-creds`) | Legitimate middle ground (rotated password, no ephemeral users); dynamic is barely more work given the engine already runs |
| Reuse runtime dynamic creds for Liquibase                 | Rejected — collapses the DDL/DML separation this ADR exists to create                                                      |

## Consequences

- A crash mid-migration leaves `DATABASECHANGELOGLOCK.LOCKEDBY` naming a vanished
  ephemeral user; remediation (`liquibase unlock` / `UPDATE ... SET LOCKED=0`) is the
  same as with a static user.
- `bot-pilot-core-dev-policy.hcl` gains read on
  `database/creds/bot-pilot-core-liquibase-role`; developer policies must NOT (see
  [liquibase-environment-hardening.md](../liquibase-environment-hardening.md)).
- [vault-architecture.md](../vault-architecture.md) and
  [mariadb-vault-setup.md](../mariadb-vault-setup.md) need updating when steps 1/3 land.

## Implementation status

| Step                                                                                       | Status                                                             |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| Dedicated Liquibase credential, separate from runtime (`spring.liquibase.*` from Vault KV) | **Implemented** (static user, server-side)                         |
| Stage-gated execution (`spring.liquibase.enabled`)                                         | **Implemented** ([ADR 0001](0001-liquibase-schema-management.md))  |
| Runtime role tightened to DML-only                                                         | **Implemented** for `creation_statement` for dynamic runtime users |
| Dynamic `bot-pilot-core-liquibase-role` + `spring.cloud.vault.databases.*` wiring          | **TODO** (planned as above)                                        |

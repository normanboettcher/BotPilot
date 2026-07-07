# ADR 0001 — Liquibase for Database Schema Management

**Status:** Accepted (implemented 2026-07-06, issue #119, branch `feature/119`)

## Context

`bot-pilot-core` runs against MariaDB with `spring.jpa.hibernate.ddl-auto=validate` — a
deliberate, pre-existing rule: Hibernate never manages DDL. Until now nothing created the
schema at all; the single required table (`google_credentials`, mapped by the
`GoogleCalendarCredentials` entity in the google-calendar-connector domain module) had to
be pre-created by hand. The schema must stay byte-compatible with the legacy Python
SQLAlchemy model. Credentials for the datasource are injected dynamically by Vault
(see [vault-architecture.md](../vault-architecture.md)).

## Decision

Adopt **Liquibase** for all schema management, wired as follows:

1. **Ownership**: `org.liquibase:liquibase-core` (version managed by the Spring Boot BOM)
   and all changelogs live in **`bot-pilot-core-runner`** — the composition root. The
   schema is a deployment concern of the assembled application, not of any single
   bounded-context module.
2. **Format**: YAML master changelog
   (`src/main/resources/db/changelog/db.changelog-master.yaml`) with **formatted-SQL
   changesets** in per-release directories (`v1.0.0/0001-create-google-credentials.sql`).
   Native MariaDB DDL is directly reviewable against the legacy Python schema.
3. **Explicit `include` instead of `includeAll`**: a changeset only runs if it is listed
   in the master changelog — deterministic order, reviewable diff, no classpath-scan
   surprises inside the fat JAR.
4. **Defensive precondition**: the initial changeset carries a
   `tableExists`-equivalent SQL check with `onFail:MARK_RAN`, so an environment where the
   table already exists (legacy Python era, manual creation) is adopted instead of
   crashing.
5. **Execution model**: migrations run **at application startup** via Boot's
   `SpringLiquibase` — not as a decoupled CI/CD or job step. Stage gating is a separate
   decision (see below); credential model is [ADR 0002](0002-liquibase-credential-model.md).
6. `ddl-auto` **stays `validate`** — Liquibase creates/evolves, Hibernate only verifies.
7. Housekeeping: the unused `com.mysql:mysql-connector-j` managed dependency (and its
   version property) was removed from the parent POM; the real driver is
   `mariadb-java-client`.

### Stage gating (fail-safe)

`spring.liquibase.enabled: false` is the default in `application.yml`. Only
`application-dev.yml` — activated by `SPRING_PROFILES_ACTIVE=dev`, which is set
exclusively by the deployment configuration (`bot-pilot-config` →
[dev-deployment-workflow.md](../dev-deployment-workflow.md)) — flips it to `true`.
The default profile `local` therefore **never migrates**, regardless of which database a
developer points at. Future stages get their own `application-<stage>.yml` with the same
one-liner. The flag is an accident guard, not a security control — real enforcement is
documented in
[liquibase-environment-hardening.md](../liquibase-environment-hardening.md).

## Rationale

- **Why startup execution (option a) over a decoupled migration step (option b)**: this
  deployment is a **single app instance** under rootless `podman compose` on one VPS —
  no Kubernetes Job/init-container primitive, no replica race at deploy, no long
  migrations. A CI-run migration step would require DB + Vault reachability from GitHub
  Actions runners and would move DDL-capable credentials into the CI trust surface —
  strictly worse than the AppRole-authenticated container fetching them itself.
- **Why formatted SQL**: the project rule was already "write a migration SQL script";
  exact MariaDB DDL keeps the legacy-schema compatibility reviewable.
- **Why the runner owns changelogs**: if a bounded context is ever split into its own
  service, its changelogs move with its runner.

## Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Flyway | Liquibase chosen (issue #119); preconditions + changelog formats fit the adopt-existing-schema case better |
| `includeAll` directory scan | Non-deterministic feel, fat-JAR scanning edge cases, changesets can sneak in without review |
| Pure XML/YAML changesets | More ceremony; auto-rollback generation not worth losing native-SQL reviewability here |
| `liquibase:generateChangeLog` from a live DB | One hand-written table beats generator noise; no live pre-created DB existed |
| CI/CD or job-based migration step (option b) | See rationale — wrong trade-off for a single-instance podman-compose deployment. The layout deliberately keeps this door open: the same changelogs run unchanged via the Liquibase CLI/Maven plugin if migrations are ever decoupled |

## Consequences

- Every schema change is a new formatted-SQL changeset in a release directory, explicitly
  included in the master changelog. Never touch `ddl-auto`.
- Startup on a deployed stage acquires `DATABASECHANGELOGLOCK`; a crash mid-migration
  requires a manual unlock (documented Liquibase remediation).
- Local developers with a throwaway DB opt in deliberately via
  `SPRING_LIQUIBASE_ENABLED=true`.
- Moving to a decoupled migration step later (multi-replica, prod change control) is a
  pipeline change only — no changelog rework.

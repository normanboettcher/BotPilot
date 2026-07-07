# Environment Hardening — Liquibase & Stage Credential Boundaries

## Table of Contents

[1. The Central Premise](#1-the-central-premise)

[2. Layered Enforcement Model](#2-layered-enforcement-model)

[3. Layer 1 — Service Identity: Hardening the AppRole secret_id](#3-layer-1--service-identity-hardening-the-approle-secret_id)

[4. Layer 2 — Developer Identity vs. Service Identity](#4-layer-2--developer-identity-vs-service-identity)

[5. Layer 3 — Database-Level Defense in Depth](#5-layer-3--database-level-defense-in-depth)

[6. Threat → Control Matrix](#6-threat--control-matrix)

[7. Hardening Checklist (current state vs. TODO)](#7-hardening-checklist-current-state-vs-todo)

Related: [ADR 0001 — Liquibase](adr/0001-liquibase-schema-management.md) ·
[ADR 0002 — Credential model](adr/0002-liquibase-credential-model.md) ·
[vault-architecture.md](vault-architecture.md) ·
[dev-deployment-workflow.md](dev-deployment-workflow.md)

---

## 1. The Central Premise

**The Spring profile flag is a safety default, not a security control.**

`spring.liquibase.enabled: false` (default) / `true` (only in `application-dev.yml`)
prevents *accidents* — a developer starting the app locally will never migrate anything.
But nothing stops a developer from exporting `SPRING_PROFILES_ACTIVE=dev` or
`SPRING_LIQUIBASE_ENABLED=true` on their laptop. Spring config is attacker-controlled
input on any machine the attacker controls.

Real enforcement must therefore live where the developer's laptop has no authority:

- **Vault** — who can obtain which credentials, from where.
- **The database** — what each credential is allowed to do once connected.

The desired failure mode: a developer who sets `SPRING_PROFILES_ACTIVE=dev` locally gets
an application that **fails to authenticate to Vault** — no credentials, no migration,
no runtime DB access. Not an application that quietly migrates the dev database.

---

## 2. Layered Enforcement Model

| Layer | Control | Stops |
|---|---|---|
| 0. Spring config | `liquibase.enabled=false` default, `true` only per stage profile | Accidents |
| 1. Vault auth | Deployed service's AppRole `secret_id` exists only inside the deployed container; CIDR-bound; short TTL | Impersonating the service off-host |
| 2. Vault policy | Developer identities carry a policy that cannot read dev-stage or DDL credential paths | Developers fetching stage/DDL creds with their own token |
| 3. Database grants | Runtime role is DML-only; only the Liquibase role has DDL; DB users host-scoped | Damage even after a credential leak |

A control only counts if it holds when all layers above it have failed.

---

## 3. Layer 1 — Service Identity: Hardening the AppRole secret_id

The `bot-pilot-core` AppRole `secret_id` is the key to everything the deployed service
can read — including the dev-stage KV secret carrying `spring.liquibase.user/password`.
**It must never exist on a developer machine.** If that single invariant holds, a local
`SPRING_PROFILES_ACTIVE=dev` start dies at Vault login (`role_id` alone is useless —
it is deliberately treated as non-secret, see
[vault-architecture.md §6](vault-architecture.md)).

### 3.1 Current state and its gaps

The current AppRole configuration (vault-architecture.md §6) uses:

```bash
secret_id_ttl=0        # never expires
secret_id_num_uses=0   # unlimited uses
```

and the secret_id is pre-provisioned as a long-lived file on the VPS host, mounted
read-only into the container (`/run/secrets/...`). Additionally, the documented `local`
flow lets developers *generate a personal secret-id for the service AppRole* — which
makes the service identity reachable from developer machines and defeats the boundary.

**Weak point to call out explicitly:** deployment configuration flows through the
private `bot-pilot-config` git repo. Config repos and git history are the wrong place
for any secret material. Today the secret_id lives on the host filesystem (not in the
repo) — keep it that way, and prefer the pipeline-delivered short-lived mechanism below
over any temptation to "just commit it encrypted."

### 3.2 Target configuration

```bash
vault write auth/approle/role/bot-pilot-core-dev \
  token_ttl=1h \
  token_max_ttl=24h \
  token_policies="bot-pilot-core-dev-policy" \
  secret_id_ttl=24h \
  secret_id_num_uses=5 \
  secret_id_bound_cidrs="100.x.y.z/32" \
  token_bound_cidrs="100.x.y.z/32"
```

- **`secret_id_ttl` / `secret_id_num_uses`**: a secret_id is a bootstrap credential, not
  a permanent one. Short TTL + low use count means a copied secret_id goes stale before
  it is useful. (`num_uses` must cover restarts within the TTL window — 5 is a starting
  point, tune to your restart behaviour.)
- **`secret_id_bound_cidrs`**: Vault rejects the login unless it originates from the dev
  VPS address (its Tailscale address, `100.x.y.z`). A stolen secret_id is unusable from
  a laptop — even one on the same Tailnet, since it binds to the *host*, not the network.
- **`token_bound_cidrs`**: the same restriction on the resulting token, so an
  exfiltrated token is equally useless off-host.

### 3.3 Delivery: response-wrapped, pipeline-injected

Instead of a permanent file on the host, the deploy pipeline
([dev-deployment-workflow.md](dev-deployment-workflow.md)) mints a fresh secret_id at
deploy time and delivers it response-wrapped:

```bash
# In the deploy step (runner is on the Tailnet already):
vault write -wrap-ttl=120s -f auth/approle/role/bot-pilot-core-dev/secret-id
# → wrapping token, single-use, 120s lifetime
```

The wrapping token is passed to the host, unwrapped there (`vault unwrap`) into the
`/run/secrets/...` file just before `podman compose up`. Properties: single-use (an
interception is *detectable* — unwrap fails on the host), 120-second lifetime, and the
actual secret_id never transits the pipeline logs or the config repo. The GitHub runner
needs its own Vault identity for this (JWT/OIDC auth for GitHub Actions is the natural
fit and is already listed as the prod mechanism in vault-architecture.md §6).

**Net effect:** with 3.2 + 3.3 in place, `SPRING_PROFILES_ACTIVE=dev` on a laptop
produces `permission denied` at AppRole login. The application never sees a datasource
credential, never sees `spring.liquibase.*`, and Liquibase — even if force-enabled —
has nothing to connect with.

---

## 4. Layer 2 — Developer Identity vs. Service Identity

Developers authenticate to Vault **as themselves** (`userpass` today, OIDC when an IdP
exists — vault-architecture.md §5), never via the service AppRole. Human policies grant
only what local work needs.

**Retire the documented flow where a developer generates a secret-id for the service
AppRole.** Minting service secret-ids (`auth/approle/role/+/secret-id`) is a
deploy-pipeline privilege only.

### 4.1 Policy split

`bot-pilot-core-dev-policy.hcl` — the **service**, deployed only (unchanged in spirit
from [vault-architecture.md §8](vault-architecture.md), plus the planned Liquibase role
from [ADR 0002](adr/0002-liquibase-credential-model.md)):

```hcl
# Runtime DB credentials (DML-only once Layer 3 lands)
path "database/creds/bot-pilot-core-dev-role" {
  capabilities = ["read"]
}

# Liquibase DDL credentials (dynamic role, planned) — service only, never humans
path "database/creds/bot-pilot-core-liquibase-role" {
  capabilities = ["read"]
}

# Dev-stage static secrets (Google OAuth, spring.liquibase.* while still static KV)
path "secret/data/dev/bot-pilot-core/*" {
  capabilities = ["read"]
}

path "auth/token/renew-self"  { capabilities = ["update"] }
path "auth/token/lookup-self" { capabilities = ["read"] }
```

`bot-pilot-developer-policy.hcl` — **humans**, local work only:

```hcl
# Local/throwaway environment secrets only
path "secret/data/local/*" {
  capabilities = ["read"]
}

# Explicit denies — deny wins over any allow acquired via group/other policies.
# Developers never read stage credentials or any DB credential role.
path "secret/data/dev/*" {
  capabilities = ["deny"]
}
path "secret/data/prod/*" {
  capabilities = ["deny"]
}
path "database/creds/*" {
  capabilities = ["deny"]
}
# Developers never mint service secret-ids
path "auth/approle/role/+/secret-id" {
  capabilities = ["deny"]
}

path "auth/token/renew-self"  { capabilities = ["update"] }
path "auth/token/lookup-self" { capabilities = ["read"] }
```

Notes:

- Vault policy is default-deny; the explicit `deny` stanzas are belt-and-suspenders
  against future policy sprawl (e.g. a developer later added to a broader group).
- If local development ever needs a real local MariaDB via Vault, add a *separate*
  `database/creds/bot-pilot-core-local-role` pointing at the local DB connection and
  allow only that path — never widen `database/creds/*`.

---

## 5. Layer 3 — Database-Level Defense in Depth

Assume Layers 1–2 failed and someone holds a valid **runtime** credential. The database
itself must make migration impossible:

```bash
# Runtime role: DML only — no CREATE/ALTER/DROP possible with runtime creds
vault write database/roles/bot-pilot-core-dev-role \
  db_name=<connection> \
  creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}'; \
    GRANT SELECT, INSERT, UPDATE, DELETE ON <core_db>.* TO '{{name}}'@'%';" \
  default_ttl=1h max_ttl=2h
```

This replaces today's `GRANT ALL PRIVILEGES` (see
[mariadb-vault-setup.md](mariadb-vault-setup.md)) and is the highest-value single change
in this document: it converts "developer reached the dev DB with runtime creds" from
*schema compromise* into *bounded DML access*.

The DDL-capable identity (static Liquibase user today, dynamic
`bot-pilot-core-liquibase-role` per [ADR 0002](adr/0002-liquibase-credential-model.md))
remains readable exclusively through the service policy (§4.1).

Belt-and-suspenders:

- **Host-scope DB users**: `'{{name}}'@'%'` accepts connections from anywhere; scope to
  the VPS (`'{{name}}'@'100.x.y.z'` or the container subnet) so even a leaked
  username/password pair is rejected from foreign hosts. Apply to `vault_usr` (the
  Vault-owned admin user) as well.
- Keep the MariaDB port unreachable from outside the Tailnet/VPS (host firewall) —
  network reachability is the precondition for every DB-layer threat.

---

## 6. Threat → Control Matrix

| # | Threat | Controlled by | Outcome |
|---|---|---|---|
| 1 | Developer starts app locally, default profile | Layer 0: `liquibase.enabled=false` | No migration attempted |
| 2 | Developer exports `SPRING_PROFILES_ACTIVE=dev` (and/or `SPRING_LIQUIBASE_ENABLED=true`) locally | Layer 1: no service secret_id on the laptop | AppRole login fails → no datasource creds, no `spring.liquibase.*` → app exits; nothing touches the dev DB |
| 3 | Developer uses their *own* Vault login to fetch dev/Liquibase creds | Layer 2: developer policy denies `secret/data/dev/*` and `database/creds/*` | `permission denied` |
| 4 | secret_id exfiltrated from the VPS | Layer 1: `secret_id_bound_cidrs` + short TTL + low num_uses (+ single-use wrapper makes theft detectable) | Login rejected off-host; credential stale quickly |
| 5 | Vault token exfiltrated from the container | Layer 1: `token_bound_cidrs`, 1h TTL | Token unusable off-host |
| 6 | Runtime DB credential leaks (any path) | Layer 3: DML-only grants, host-scoped user, 1h lease | No DDL possible; user expires; connection refused off-host |
| 7 | Secret material committed to `bot-pilot-config` | Process rule §3.1 + wrapped delivery (nothing durable to commit) | Nothing usable in git history |

---

## 7. Hardening Checklist (current state vs. TODO)

| ✔ | Item | Status |
|---|---|---|
| [x] | `spring.liquibase.enabled=false` fail-safe default; enabled only in `application-dev.yml` | Implemented (ADR 0001) |
| [x] | Dedicated Liquibase credential separate from runtime datasource creds (`spring.liquibase.*` via Vault KV) | Implemented (static user) |
| [x] | AppRole auth for the deployed service; `role_id` treated as non-secret, secret_id file mounted read-only into the container | Implemented |
| [x] | DB/Vault reachable only via Tailnet/VPS | Implemented (verify host firewall rules) |
| [ ] | Runtime role → DML-only `creation_statements` (drop `ALL PRIVILEGES`) | **TODO — do this first** |
| [ ] | `secret_id_ttl` / `secret_id_num_uses` set (replace `0`/`0`) | TODO |
| [ ] | `secret_id_bound_cidrs` + `token_bound_cidrs` = dev VPS Tailscale address | TODO |
| [ ] | Response-wrapped secret_id minted by the deploy pipeline (GitHub OIDC/JWT auth for the runner) instead of a permanent host file | TODO |
| [ ] | `bot-pilot-developer-policy.hcl` created; developer flow for minting service secret-ids retired | TODO |
| [ ] | Dynamic `bot-pilot-core-liquibase-role` replacing the static KV user | TODO (ADR 0002) |
| [ ] | DB users host-scoped (replace `'@'%'` in creation_statements and for `vault_usr`) | TODO |
| [ ] | Update [vault-architecture.md](vault-architecture.md) §6/§8 and [mariadb-vault-setup.md](mariadb-vault-setup.md) once the above land | TODO |

# Dev Deployment Workflow

**File:** `.github/workflows/dev-deployment.yml`

## Overview

This workflow deploys the bot-pilot stack to the dev server. It is triggered automatically when any of the image build pipelines complete successfully, or manually via `workflow_dispatch`. It runs on a standard GitHub-hosted runner, connects to the dev server over Tailscale, syncs deployment config via rsync, and runs `podman compose` remotely over SSH.

## Trigger

| Trigger | Condition |
|---|---|
| `workflow_run` | Any watched image CI workflow completes with conclusion `success` |
| `workflow_dispatch` | Manual trigger from the Actions UI |

Watched upstream workflows: `Connectors Image CI`, `Frontend Image CI`, `Actions Image CI`, `Bot-Pilot Rasa Core CI`, `Bot-Pilot Core CI`, `Bot-Pilot Core Image CI`.

> `workflow_run` fires on every completion (success, failure, cancelled), so the `if:` condition gates explicitly on `.conclusion == 'success'` to avoid deploying after a broken build.

## Steps

### 1. Checkout `bot-pilot-config`

The private config repo (`normanboettcher/bot-pilot-config`) is checked out into the runner workspace using `BOT_PILOT_CONFIG_TOKEN`. This makes CI the single source of truth for what lands on the server — the server itself needs no GitHub credentials.

### 2. Connect to Tailscale

`tailscale/github-action@v3` joins the ephemeral GitHub runner to the Tailscale network using `TAILSCALE_AUTHKEY`. The runner gets a MagicDNS-routable address to the dev server. The node is automatically expelled from the network when the job ends.

### 3. Sync config to dev server

The `deployment/` subdirectory of `bot-pilot-config` is rsynced to `REMOTE_DEPLOY_DIR` on the dev server over SSH.

- `rsync --delete` ensures files removed from the config repo are also removed on the server.
- The trailing slash on the source path syncs the *contents* of `deployment/`, so the compose file lands directly at `REMOTE_DEPLOY_DIR/docker-compose.yml`.
- The SSH key is written to a temp file, used, and deleted within the same step.

### 4. Deploy via SSH (`appleboy/ssh-action`)

A single SSH session runs the deployment script on the dev server:

1. Derives the rootless Podman socket path from `id -u` — `$XDG_RUNTIME_DIR` is not reliably set in non-login SSH sessions.
2. Logs in to Docker Hub via `podman login`.
3. Pulls updated images **before** stopping the stack — if the pull fails the running containers are untouched.
4. Brings the stack down, starts it back up with `podman compose up -d`, and prints the running service status.

### 5. Deployment summary

A Markdown summary is written to the GitHub Actions job summary (`$GITHUB_STEP_SUMMARY`), showing trigger, actor, ref, and a link to the run. Runs with `if: always()` so it captures failure state too.

## Environment variables

| Variable | Value                                | Purpose |
|---|--------------------------------------|---|
| `REMOTE_DEPLOY_DIR` | `/home/deploy/apps/bot-pilot-deploy` | Target directory on the dev server |
| `CONFIG_DEPLOY_SUBDIR` | `deployment`                         | Subdirectory in `bot-pilot-config` to sync |

## Required secrets

| Secret | Description                                                                                                          |
|---|----------------------------------------------------------------------------------------------------------------------|
| `TAILSCALE_AUTHKEY` | Ephemeral, pre-authorized Tailscale auth key. Generate at tailscale.com/admin/settings/keys.                         |
| `DEV_SSH_PRIVATE_KEY` | Private key for SSH access to the dev server. Add the matching public key to `~/.ssh/authorized_keys` on the server. |
| `DEV_SSH_HOST` | Tailscale MagicDNS hostname or IP of the dev server.                                                                 |
| `DEV_SSH_USER` | SSH login user on the dev server (e.g. `deploy`).                                                                    |
| `DOCKER_HUB_USERNAME` | Docker Hub username for pulling images.                                                                              |
| `DOCKER_HUB_TOKEN` | Docker Hub access token (read-only scope is sufficient).                                                             |
| `BOT_PILOT_CONFIG_TOKEN` | GitHub PAT with `contents: read` on `normanboettcher/bot-pilot-config`.                                              |

## Server prerequisites

- Rootless Podman with the Podman socket enabled (`systemctl --user enable --now podman.socket`).
- `podman-compose` or Podman >= 4.x (`podman compose` built-in) installed for the deploy user.
- `rsync` installed on the server.
- The deploy user's SSH public key in `~/.ssh/authorized_keys`.
- The dev server reachable via Tailscale (joined to the same Tailnet).

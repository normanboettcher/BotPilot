# ---------------------------------------------------------------------------
# bot-pilot – Makefile
#
# Prerequisites:
#   pip install hatch          (once, into your system / base Python)
#
# Usage:
#   make fmt            Apply black formatting
#   make lint           Run flake8
#   make unit           Run unit tests
#   make coverage       Run unit tests + generate htmlcov/ HTML report
#   make integration    Run integration tests
#   make rasa           Run Rasa NLU tests
#   make rasa-stories   Run Rasa story tests
#   make build          Full quality gate: fmt → lint → unit → rasa-stories
#   make dev            Start Rasa core server (foreground)
#   make dev-debug      Start Rasa core server in debug mode (foreground)
#   make action         Start Rasa action server (foreground)
#   make action-debug   Start Rasa action server in debug mode (foreground)
# ---------------------------------------------------------------------------

.PHONY: fmt fmt-check lint unit coverage integration rasa rasa-stories build \
        dev dev-debug action action-debug

# -- Quality -----------------------------------------------------------------

fmt:
	@echo "Formatting source with black..."
	hatch run fmt:run

fmt-check:
	@echo "Checking formatting (no changes written)..."
	hatch run fmt:check

lint:
	@echo "Linting with flake8..."
	hatch run lint:run

unit:
	@echo "Running unit tests..."
	hatch run test:unit

coverage:
	@echo "Running unit tests with coverage (output → htmlcov/)..."
	hatch run test:coverage

integration:
	@echo "Running integration tests..."
	hatch run integration:test

rasa:
	@echo "Running Rasa NLU tests..."
	hatch run rasa:nlu

rasa-stories:
	@echo "Running Rasa story tests..."
	hatch run rasa:stories

# Full quality gate — mirrors the CI pipeline order
build: fmt lint unit rasa-stories

# -- Dev servers -------------------------------------------------------------
# These targets intentionally do NOT install requirements themselves;
# use `hatch env create` or a dedicated venv for dev server dependencies.

dev:
	@echo "Starting Rasa server..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005

dev-debug:
	@echo "Starting Rasa server in debug mode..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005 --debug

action:
	@echo "Starting Rasa action server..."
	rasa run actions --actions bot_pilot.actions --port 5055

action-debug:
	@echo "Starting Rasa action server in debug mode..."
	rasa run actions --actions bot_pilot.actions --port 5055 --debug

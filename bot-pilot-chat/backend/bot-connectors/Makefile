connector_debug:
	@echo "Running connector_debug app in debug mode..."
	python -m uvicorn bot_connectors.main:app --reload --host 0.0.0.0 --port 8000 --log-level debug --log-config logging.yaml

lint:
	@echo "Running linting checks..."
	python -m tox -e lint
test:
	@echo "Running tests..."
	python -m tox -e test

format:
	@echo "Formatting code..."
	python -m tox -e format

build: format lint test
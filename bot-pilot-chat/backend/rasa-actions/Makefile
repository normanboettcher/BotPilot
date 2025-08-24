dev_debug:
	@echo "Starting Rasa server in debug mode..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005 --debug
dev:
	@echo "Starting Rasa server..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005
action_debug:
	@echo "Starting Rasa action server in debug mode..."
	rasa run actions --actions src.actions --port 5055 --debug
action:
	@echo "Starting Rasa action server..."
	rasa run actions --actions src.actions --port 5055

lint:
	@echo "Running linters..."
	python -m  tox -e lint

format:
	@echo "Running formatters..."
	python -m tox -e format

unit_test:
	@echo "Running unit tests..."
	python -m tox -e unit_tests
integration_test:
	@echo "Running integration tests..."
	python -m tox -e integration_tests

rasa_test:
	@echo "Running Rasa tests..."
	python -m tox -e rasa_tests

build: format lint unit_test rasa_test

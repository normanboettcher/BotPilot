dev_debug:
	pip install -r requirements.txt
	@echo "Starting Rasa server in debug mode..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005 --debug
dev:
	pip install -r requirements.txt
	@echo "Starting Rasa server..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005
action_debug:
	pip install -r requirements.txt
	@echo "Starting Rasa action server in debug mode..."
	rasa run actions --actions bot_pilot.actions --port 5055 --debug
action:
	pip install -r requirements.txt
	@echo "Starting Rasa action server..."
	rasa run actions --actions bot_pilot.actions --port 5055

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

rasa_test_stories:
	@echo "Running Rasa story tests..."
	python -m tox -e rasa_story_tests

build: format lint unit_test rasa_test_stories

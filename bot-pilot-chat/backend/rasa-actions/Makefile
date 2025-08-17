dev_debug:
	@echo "Starting Rasa server in debug mode..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005 --debug
dev:
	@echo "Starting Rasa server..."
	rasa run --enable-api --cors "*" --connector socketio --port 5005
action_debug:
	@echo "Starting Rasa action server..."
	rasa run actions --actions src.actions --port 5055

lint:
	@echo "Running linters..."
	python -m  tox -e lint

format:
	@echo "Running formatters..."
	python -m tox -e format
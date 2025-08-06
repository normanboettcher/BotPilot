.PHONY: test unit integration lint format all

print_env:
	@echo "== Python info =="
	@which python
	@python --version
	@echo
	@echo "== Tox info =="
	@which tox
	@tox --version
	@echo
	@echo "====================="
	@echo

unit:
	@echo "Running unit tests..."
	$(MAKE) print_env
	python -m tox -e unit_tests

integration:
	@echo "Running integration tests..."
	$(MAKE) print_env
	python -m tox -e integration_test

lint:
	@echo "Running linters..."
	$(MAKE) print_env
	python -m tox -e lint

format:
	@echo "Running formatters..."
	$(MAKE) print_env
	python -m tox -e format

test: unit integration

build: format lint test

release: format lint test integration

dev:
	@echo "Starting development server..."
	$(MAKE) print_env
	LD_LIBRARY_PATH=/usr/local/cuda-12.5/lib64:/usr/local/cuda-12.5/lib:/home/norman/projects/bot-pilot/bot-pilot-chat/backend/.venv/lib/python3.10/site-packages/cusparselt/lib:/usr/local/cuda-12.5/extras/CUPTI/lib64:/home/norman/projects/bot-pilot/bot-pilot-chat/backend/.venv/lib/python3.10/site-packages/nvidia/nccl/lib python -m uvicorn bot_pilot_chat.main:app --reload --host 0.0.0.0

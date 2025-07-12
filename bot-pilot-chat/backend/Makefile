.PHONY: test unit integration lint format all

unit:
	python -m tox -e unit_tests

integration:
    python -m tox -e integration_test

lint:
	python -m tox -e lint

format:
	python -m tox -e format

test: unit integration

build: format lint test

dev:
	uvicorn bot_pilot_chat.main:app --reload

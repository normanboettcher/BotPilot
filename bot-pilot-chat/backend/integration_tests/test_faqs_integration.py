from unittest.mock import patch
from .integration_test_config import integration_test_config

from fastapi.testclient import TestClient
from bot_pilot_chat.main import app

client = TestClient(app)


@patch("bot_pilot_chat.service.matching.text_matching.app_config")
def test_faq_api_success(app_config_mock):
    app_config_mock.return_value = integration_test_config()
    payload = {"question": "Gibt es in der Nähe Parkplätze?"}
    response = client.post("/api/faqs", json=payload)

    assert response.status_code == 200
    json_data = response.json()
    assert json_data.get("success") is True
    assert "Vielzahl" in json_data.get("answer")
    assert "Parkmöglichkeiten" in json_data.get("answer")


def test_faq_api_no_answer():
    payload = {"question": "Frage die niemand beantworten kann."}
    response = client.post("/api/faqs", json=payload)

    assert response.status_code == 200
    json_data = response.json()
    assert json_data.get("success") is False

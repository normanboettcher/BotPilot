from unittest.mock import patch

from bot_pilot_chat.service.matching import find_most_similar
from ...config import app_test_config


@patch("bot_pilot_chat.service.matching.text_matching.app_config")
def test_find_most_similar_returns_answer(app_config_mock):
    app_config_mock.return_value = app_test_config()
    question = "Welche Dokumente brauche ich für die Steuererklärung?"
    response = find_most_similar(question, threshold=0.3)

    assert response._success is True
    assert "Einkommensnachweise" in response._answer
    assert "Belege" in response._answer
    assert "Sonderausgaben" in response._answer
    assert response._score >= 0.3


@patch("bot_pilot_chat.service.matching.text_matching.app_config")
def test_find_most_similar_no_answer(app_config_mock):
    app_config_mock.return_value = app_test_config()
    question = "Unverständliche Frage ohne Antwort"
    response = find_most_similar(question, threshold=0.9)

    assert response._success is False

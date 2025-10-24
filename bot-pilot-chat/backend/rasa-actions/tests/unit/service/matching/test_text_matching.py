from unittest.mock import patch

from bot_pilot.service.matching import find_most_similar_faq
from unit.config import app_test_config


@patch("bot_pilot.service.matching.text_matching.app_config")
def test_find_most_similar_returns_answer(app_config_mock):
    app_config_mock.return_value = app_test_config()
    question = "Welche Dokumente brauche ich für die Steuererklärung?"
    response = find_most_similar_faq(question, threshold=0.7)

    assert response.get_success() is True
    assert "Einkommensnachweise" in response.get_answer()
    assert "Belege" in response.get_answer()
    assert "Sonderausgaben" in response.get_answer()
    assert response.get_score() >= 0.7
    print("response score:", response.get_score())


@patch("bot_pilot.service.matching.text_matching.app_config")
def test_find_most_similar_no_answer(app_config_mock):
    app_config_mock.return_value = app_test_config()
    question = "Unverständliche Frage ohne Antwort"
    response = find_most_similar_faq(question, threshold=0.7)

    assert response._success is False

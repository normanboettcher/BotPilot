from unittest.mock import patch

import pytest

from bot_pilot_chat.service.matching.text_matching import find_most_similar_faq
from tests.config import app_test_config
import os
from dotenv import load_dotenv


@pytest.fixture(scope="session", autouse=True)
def before_all():
    """Setup before all tests."""
    # This function can be used to set up any global state or configurations needed for the tests.
    env_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "conf", "local.env"
    )
    load_dotenv(dotenv_path=env_path, verbose=True)
    print(
        "before_all set LD_LIBRARY_PATH to:", os.environ.get("LD_LIBRARY_PATH")
    )
    yield
    """Teardown after all tests."""
    del os.environ["LD_LIBRARY_PATH"]


@patch("bot_pilot_chat.service.matching.text_matching.app_config")
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


@patch("bot_pilot_chat.service.matching.text_matching.app_config")
def test_find_most_similar_no_answer(app_config_mock):
    app_config_mock.return_value = app_test_config()
    question = "Unverständliche Frage ohne Antwort"
    response = find_most_similar_faq(question, threshold=0.7)

    assert response._success is False

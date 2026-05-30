from unittest.mock import MagicMock, patch

from bot_pilot.adapters.http_faq_adapter import HttpFaqAdapter
from bot_pilot.domain.response import BotResponse
from bot_pilot.domain.tenant_context import TenantContext

_CONTEXT = TenantContext(tenant_id="default")


@patch("bot_pilot.adapters.http_faq_adapter.requests.post")
def test_find_answer_returns_bot_response_on_success(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "answer": "Die Antwort ist 42.",
        "success": True,
        "score": 0.95,
        "sender": "bot",
        "buttons": None,
        "accessory": None,
    }
    mock_post.return_value = mock_response

    adapter = HttpFaqAdapter("http://localhost:8000/api/faqs")
    result = adapter.find_answer("Was ist die Antwort?", _CONTEXT)

    assert isinstance(result, BotResponse)
    assert result.answer == "Die Antwort ist 42."
    assert result.success is True
    assert result.score == 0.95


@patch("bot_pilot.adapters.http_faq_adapter.requests.post")
def test_find_answer_returns_fallback_on_exception(mock_post):
    mock_post.side_effect = ConnectionError("service down")

    adapter = HttpFaqAdapter("http://localhost:8000/api/faqs")
    result = adapter.find_answer("Was ist die Antwort?", _CONTEXT)

    assert isinstance(result, BotResponse)
    assert result.success is True
    assert "gerade nicht abrufen" in result.answer

from bot_pilot_chat.service.matching.intents.greeting_matching import (
    is_greeting,
)


def test_is_greeting_true():
    message = "Hallo, wie geht es dir?"
    result = is_greeting(message)
    assert result is True, f"Expected True for greeting message, got {result}"

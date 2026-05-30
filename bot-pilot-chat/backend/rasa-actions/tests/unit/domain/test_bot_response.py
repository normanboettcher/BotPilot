from bot_pilot.domain.response import BotResponse


def test_with_answer_factory():
    response = BotResponse.with_answer("Hallo Welt")
    assert response.answer == "Hallo Welt"
    assert response.success is True
    assert response.sender == "bot"


def test_as_dict_contains_expected_keys():
    response = BotResponse.with_answer("Test")
    result = response.as_dict()
    assert set(result.keys()) == {
        "answer",
        "success",
        "timestamp",
        "score",
        "sender",
        "buttons",
        "accessory",
    }


def test_no_answer_found_sets_success_false():
    response = BotResponse.no_answer_found()
    assert response.success is False


def test_with_answer_and_buttons():
    buttons = [{"title": "Ja", "payload": "/affirm"}]
    response = BotResponse.with_answer_and_buttons("Wählen Sie:", buttons)
    assert response.buttons == buttons
    assert response.accessory == "buttons"
    assert response.success is True


def test_timestamp_injected_by_default():
    response = BotResponse(answer="Test", success=True)
    assert response.timestamp != ""
    assert "." in response.timestamp


def test_timestamp_can_be_overridden():
    fixed = "01.01.2000 00:00"
    response = BotResponse(answer="Test", success=True, timestamp=fixed)
    assert response.timestamp == fixed

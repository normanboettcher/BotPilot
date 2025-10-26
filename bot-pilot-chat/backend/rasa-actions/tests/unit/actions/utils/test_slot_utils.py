import pytest

from bot_pilot.actions.utils.slot_utils import meeting_date_from_slot_value, clear_slots


def test_meeting_date_from_slot_value_success():
    # given
    slot_value = "2023-10-01T12:00:00.000Z"

    # when
    result = meeting_date_from_slot_value(slot_value)

    # then
    assert result == "01.10.2023 12:00"


@pytest.mark.parametrize(
    "slot_value", [("slot_value"), (None), ("20-01-2023T12:00:00Z")]
)
def test_meeting_date_from_slot_value_failure(slot_value):
    # when
    result = meeting_date_from_slot_value(slot_value)

    # then
    assert result is None


def test_clear_slots():
    # given
    collected_slots = ["name", "mail"]

    # when
    result = clear_slots(collected_slots)
    print(result)

    # then
    assert len(result) == 2
    assert result[0].value is None
    assert result[1].value is None
    assert result[0].key == "name"
    assert result[1].key == "mail"

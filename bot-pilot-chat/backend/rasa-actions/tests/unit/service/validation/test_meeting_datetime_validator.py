from bot_pilot.service.validation.meeting_datetime_validator import is_utc_datetime


def test_extract_date_from_message():
    assert is_utc_datetime("2003-01-20T12:00:00.000Z")

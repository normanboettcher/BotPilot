from bot_pilot.service.validation.meeting_datetime_validator import is_utc_datetime


def test_extract_date_from_message():
    # given
    message = "20-01-2023T12:00:00Z"

    # when
    result = is_utc_datetime(message)

    # then
    assert result == True

import pytest

from bot_connectors.domain.calendar.events.event_attendee import EventAttendee
from bot_connectors.domain.calendar.events.event_time import EventTime
from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)
from datetime import datetime, timedelta, UTC

now = datetime.now(UTC).isoformat() + "Z"
tomorrow = (datetime.now(UTC) + timedelta(days=1)).isoformat() + "Z"


@pytest.fixture
def event():
    event = GoogleCalendarEvent(
        summary="summary",
        start=EventTime(date_time=now, time_zone="UTC"),
        end=EventTime(date_time=tomorrow, time_zone="UTC"),
        description="a test description",
        attendees=[EventAttendee(email="example@mail.com")],
    )
    yield event


def test_asdict_end_and_start_time(event: GoogleCalendarEvent):
    # when
    as_dict = event.as_dict()

    # then
    # time keys have to be in camel case for google api
    assert as_dict.get("start") == {"dateTime": now, "timeZone": "UTC"}
    assert as_dict.get("end") == {"dateTime": tomorrow, "timeZone": "UTC"}


def test_asdict_attendees(event: GoogleCalendarEvent):
    # when
    as_dict = event.as_dict()

    # then
    assert len(as_dict.get("attendees")) == 1
    assert as_dict.get("attendees")[0].get("email") == "example@mail.com"


def test_asdict_no_description(event: GoogleCalendarEvent):
    # given
    event.description = None

    # when
    as_dict = event.as_dict()
    print(as_dict)

    # then
    assert as_dict.get("description") is None

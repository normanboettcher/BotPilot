from datetime import datetime, UTC, timedelta
from unittest.mock import patch, MagicMock

import pytest

from bot_connectors.service.calendar.google.google_calendar_events_provider import (
    GoogleCalendarEventsProvider,
)

now = datetime.now(UTC).isoformat()
tomorrow = (datetime.now(UTC) + timedelta(days=1)).isoformat()


@patch(
    "bot_connectors.service.calendar.google.google_calendar_client.GoogleCalendarClient"
)
def test_build_events_result_from_response(client_mock):
    # given
    provider = GoogleCalendarEventsProvider(client_mock)
    events = [{"start": now, "end": tomorrow}, {"start": now, "end": tomorrow}]

    # when
    busy_events = provider.build_events_result_from_response(events)

    # then
    assert len(busy_events) == 2
    assert busy_events[0].start.date_time == now
    assert busy_events[0].end.date_time == tomorrow
    assert busy_events[1].start.date_time == now
    assert busy_events[1].end.date_time == tomorrow


@patch(
    "bot_connectors.service.calendar.google.google_calendar_client.GoogleCalendarClient"
)
def test_build_events_result_from_response_empty_events(client_mock):
    # given
    provider = GoogleCalendarEventsProvider(client_mock)
    events = []

    # when
    busy_events = provider.build_events_result_from_response(events)

    # then
    assert len(busy_events) == 0


@patch(
    "bot_connectors.service.calendar.google.google_calendar_client.GoogleCalendarClient"
)
def test_read_busy_events_next_empty(client_mock):
    # given
    client_service = MagicMock()
    client_service.freebusy().query().execute.return_value = {
        "calendars": {"primary": {"busy": []}}
    }
    client_mock.get_google_calendar_as_service = MagicMock(return_value=client_service)
    provider = GoogleCalendarEventsProvider(client_mock)

    # when
    busy_events = provider.read_busy_events_next("test", 30)

    # then
    assert len(busy_events) == 0


@patch(
    "bot_connectors.service.calendar.google.google_calendar_client.GoogleCalendarClient"
)
def test_read_busy_events_next_calendar_error_no_permission(client_mock):
    # given
    client_service = MagicMock()
    errors = [
        {
            "domain": "global",
            "reason": "permission denied",
            "message": "permission denied for calendar",
        }
    ]
    client_service.freebusy().query().execute.return_value = {
        "calendars": {"primary": {"errors": errors}}
    }
    client_mock.get_google_calendar_as_service = MagicMock(return_value=client_service)
    provider = GoogleCalendarEventsProvider(client_mock)

    # when
    with pytest.raises(Exception) as e:
        provider.read_busy_events_next("test", 30)

    # then
    assert e.value.args[0] == f"Error requesting busy events: [{errors}]"

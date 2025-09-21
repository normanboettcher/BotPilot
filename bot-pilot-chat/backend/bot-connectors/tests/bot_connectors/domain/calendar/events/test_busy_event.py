from datetime import datetime, UTC, timedelta

from bot_connectors.domain.calendar.events.busy_event import BusyEvent

now = datetime.now(UTC)
tomorrow = datetime.now(UTC) + timedelta(days=1)


def test_from_busy_date_response():
    # given
    busy_hours = {"start": now.isoformat(), "end": tomorrow.isoformat()}

    # when
    busy_event = BusyEvent.from_busy_date_response(busy_hours)

    # then
    assert busy_event.start.date_time == now.isoformat()
    assert busy_event.end.date_time == tomorrow.isoformat()

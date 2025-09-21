import logging
from typing import List

from fastapi.params import Depends
from datetime import datetime, timedelta, UTC

from bot_connectors.domain.calendar.events.busy_event import BusyEvent
from bot_connectors.service.calendar.api.calendar_event_reader import (
    CalendarEventsReader,
)
from bot_connectors.service.calendar.google.google_calendar_client import (
    GoogleCalendarClient,
    get_google_calendar_client,
)

logger = logging.getLogger(__name__)


class GoogleCalendarEventsProvider(CalendarEventsReader):

    def __init__(self, calendar_client: GoogleCalendarClient):
        self._calendar_client = calendar_client

    def read_busy_events_next(
        self, customer_context: str, next_days: int = 90
    ) -> List[BusyEvent] | None:
        try:
            calendar_service = self._calendar_client.get_google_calendar_as_service(
                customer_context
            )
            if calendar_service is None:
                return None
            now = datetime.now(UTC).isoformat()
            time_max = (datetime.now(UTC) + timedelta(days=next_days)).isoformat()
            # TODO: use UTC here instead of Europe/Berlin
            body = {
                "timeMin": now,
                "timeMax": time_max,
                "timeZone": "Europe/Berlin",
                "items": [{"id": "primary"}],
            }
            events_result = calendar_service.freebusy().query(body=body).execute()
            calendar = events_result["calendars"].get("primary", {})
            if "errors" in calendar:
                raise Exception(f'Error requesting busy events: [{calendar["errors"]}]')

            return self.build_events_result_from_response(calendar.get("busy", []))

        except Exception as e:
            logger.error(f"Failed to get busy events for [{customer_context}]: [{e}]")
            raise

    def build_events_result_from_response(self, events: list) -> List[BusyEvent]:
        busy_events: List[BusyEvent] = list()
        for event in events:
            busy_event: BusyEvent = BusyEvent.from_busy_date_response(event)
            busy_events.append(busy_event)
        return busy_events


def get_google_calendar_events_provider(
    calendar_client: GoogleCalendarClient = Depends(get_google_calendar_client),
):
    return GoogleCalendarEventsProvider(calendar_client)

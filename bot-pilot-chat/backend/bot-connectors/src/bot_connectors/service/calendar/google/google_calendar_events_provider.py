import logging

from fastapi.params import Depends
from datetime import datetime, timedelta, UTC

from bot_connectors.service.calendar.api.calendar_event_reader import (
    CalendarEventsReader,
)
from bot_connectors.service.calendar.google.google_calendar_client import (
    GoogleCalendarClient,
    get_google_calendar_client,
)

logger = logging.Logger(__name__)


class GoogleCalendarEventsProvider(CalendarEventsReader):

    def __init__(self, calendar_client: GoogleCalendarClient):
        self._calendar_client = calendar_client

    def read_busy_events_next(
        self, customer_context: str, next_days: int = 90
    ) -> list | None:
        try:
            calendar_service = self._calendar_client.get_google_calendar_as_service(
                customer_context
            )
            if calendar_service is None:
                return None
            now = datetime.now(UTC).isoformat() + "Z"
            time_max = (datetime.now(UTC) + timedelta(days=next_days)).isoformat() + "Z"
            body = {
                "timeMin": now,
                "timeMax": time_max,
                "timeZone": "UTC",
                "items": [{"id": "primary"}],
            }
            events_result = calendar_service.freebusy().query(body=body).execute()
            logger.debug(f"calendar_events_result: {events_result}")
            return events_result["calendars"]["primary"]

        except Exception as e:
            logger.error(
                f"Failed to get busy events for [{customer_context}]:" f"[{e}]"
            )
            raise


def get_google_calendar_events_provider(
    calendar_client: GoogleCalendarClient = Depends(get_google_calendar_client),
):
    return GoogleCalendarEventsProvider(calendar_client)

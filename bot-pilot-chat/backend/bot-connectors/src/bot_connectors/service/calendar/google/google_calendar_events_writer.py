import logging

from fastapi.params import Depends

from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)
from bot_connectors.service.calendar.api.calendar_event_writer import (
    CalendarEventWriter,
)
from bot_connectors.domain.calendar.events.calender_event_creation_result import (
    CalendarEventCreationResult,
)
from bot_connectors.service.calendar.google.google_calendar_client import (
    GoogleCalendarClient,
    get_google_calendar_client,
)

logger = logging.getLogger(__name__)


class GoogleCalendarEventsWriter(CalendarEventWriter):

    def __init__(self, client: GoogleCalendarClient):
        self._client = client

    def create_event(
        self, event: GoogleCalendarEvent, customer_context: str
    ) -> CalendarEventCreationResult:
        try:
            service = self._client.get_google_calendar_as_service(customer_context)
            if service is None:
                logger.warning(
                    f"Es konnte kein Verbindung zum GoogleClient "
                    f"hergestellt werden für context: [{customer_context}]."
                )
                return CalendarEventCreationResult.failure(
                    "Es konnte keine Verbindung "
                    "zum GoogleClient hergestellt "
                    "werden."
                )
            event_created = (
                service.events()
                .insert(calendarId="primary", body=event.as_dict())
                .execute()
            )
            logger.debug(f"event created: [{event_created}]")
            if event_created is None:
                return CalendarEventCreationResult.failure(
                    f"Das Event: [{event.as_dict()}]" f" konnte nicht erstellt werden."
                )
            return CalendarEventCreationResult.success()
        except Exception as e:
            logger.error(
                f"Beim Versuch das event: [{event.as_dict()}] zu erzeugen kam "
                f"es zu einem schwerwiegenden Fehler: [{e}]"
            )
            raise


def get_google_calendar_events_writer(
    client: GoogleCalendarClient = Depends(get_google_calendar_client),
) -> GoogleCalendarEventsWriter:
    return GoogleCalendarEventsWriter(client)

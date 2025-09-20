from abc import ABC

from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)
from bot_connectors.domain.calendar.events.calender_event_creation_result import (
    CalendarEventCreationResult,
)


class CalendarEventWriter(ABC):
    def create_event(
        self, event: GoogleCalendarEvent, customer_context: str
    ) -> CalendarEventCreationResult:
        pass

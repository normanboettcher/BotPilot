from abc import ABC

from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)
from bot_connectors.service.calendar.calender_creation_result import (
    CalendarCreationResult,
)


class CalendarEventWriter(ABC):
    def create_event(
        self, event: GoogleCalendarEvent, customer_context: str
    ) -> CalendarCreationResult:
        pass

from abc import ABC

from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)


class CalendarEventWriter(ABC):
    def create_event(self, event: GoogleCalendarEvent):
        pass

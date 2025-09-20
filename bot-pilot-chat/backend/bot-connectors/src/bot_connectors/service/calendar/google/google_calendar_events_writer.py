from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)
from bot_connectors.service.calendar.api.calendar_event_writer import (
    CalendarEventWriter,
)


class GoogleCalendarEventsWriter(CalendarEventWriter):

    def create_event(self, event: GoogleCalendarEvent):
        pass

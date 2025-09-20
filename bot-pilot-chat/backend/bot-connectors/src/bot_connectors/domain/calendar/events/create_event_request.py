from dataclasses import dataclass, asdict

from bot_connectors.domain.calendar.google.google_calendar_event import (
    GoogleCalendarEvent,
)


@dataclass
class CreateGoogleCalendarEventRequest:
    event: GoogleCalendarEvent
    customer_context: str

    def to_dict(self):
        return asdict(self)

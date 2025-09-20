from dataclasses import dataclass, field
from typing import Optional, List

from bot_connectors.domain.event_attendee import EventAttendee
from bot_connectors.domain.event_time import EventTime


@dataclass
class GoogleCalendarEvent:
    summary: str
    start: EventTime
    end: EventTime
    description: Optional[str] = None
    attendees: List[EventAttendee] = field(default_factory=list)

    def as_dict(self):
        return {
            "summary": self.summary,
            "description": self.description,
            "start": self.start.as_dict(),
            "end": self.end.as_dict(),
            "attendees": [attendee.as_dict() for attendee in self.attendees],
        }

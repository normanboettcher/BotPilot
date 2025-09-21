from dataclasses import dataclass, asdict
from typing import List

from bot_connectors.domain.calendar.events.busy_event import BusyEvent


@dataclass
class BusyEventsResponse:
    timespan_days: int
    busy_events: List[BusyEvent]

    def to_dict(self):
        return asdict(self)

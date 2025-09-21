from abc import abstractmethod, ABC
from typing import List

from bot_connectors.domain.calendar.events.busy_event import BusyEvent


class CalendarEventsReader(ABC):
    @abstractmethod
    def read_busy_events_next(
        self, customer_context: str, next_days: int = 90
    ) -> List[BusyEvent] | None:
        pass

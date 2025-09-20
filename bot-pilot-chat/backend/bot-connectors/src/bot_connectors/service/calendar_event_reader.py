from abc import abstractmethod, ABC


class CalendarEventsReader(ABC):
    @abstractmethod
    def read_busy_events_next(self, customer_context: str,
                                next_days: int = 90
                                ) -> list | None:
        pass

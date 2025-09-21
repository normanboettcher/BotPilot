from dataclasses import dataclass, asdict

from bot_connectors.domain.calendar.events.event_time import EventTime


@dataclass
class BusyEvent:
    start: EventTime
    end: EventTime

    def to_dict(self):
        return asdict(self)

    @staticmethod
    def from_busy_date_response(busy):
        start, end = busy["start"], busy["end"]
        return BusyEvent(
            EventTime.from_datetime_str(start), EventTime.from_datetime_str(end)
        )

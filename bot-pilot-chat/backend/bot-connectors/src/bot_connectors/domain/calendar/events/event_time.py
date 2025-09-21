from dataclasses import dataclass
from datetime import datetime
from dateutil import parser


@dataclass
class EventTime:
    date_time: str
    time_zone: str

    def as_dict(self):
        return {"dateTime": self.date_time, "timeZone": self.time_zone}

    @staticmethod
    def from_datetime_str(date: str):
        as_date = parser.isoparse(date)
        return EventTime(as_date.isoformat(), "Europe/Berlin")

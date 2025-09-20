from dataclasses import dataclass


@dataclass
class EventTime:
    date_time: str
    time_zone: str

    def as_dict(self):
        return {"dateTime": self.date_time, "timeZone": self.time_zone}

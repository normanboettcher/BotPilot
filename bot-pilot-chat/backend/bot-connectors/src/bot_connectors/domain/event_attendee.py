from dataclasses import dataclass, asdict


@dataclass
class EventAttendee:
    email: str

    def as_dict(self):
        return asdict(self)

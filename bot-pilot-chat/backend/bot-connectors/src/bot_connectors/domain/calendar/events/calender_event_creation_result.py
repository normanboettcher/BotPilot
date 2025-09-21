from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class CalendarEventCreationResult:
    success: bool
    message: Optional[str] = None

    def is_success(self):
        return self.success

    def get_error_messages(self):
        return self.message

    def to_dict(self):
        return asdict(self)

    @staticmethod
    def failure(errors: str):
        return CalendarEventCreationResult(False, errors)

    @staticmethod
    def success():
        return CalendarEventCreationResult(True, "event created successfully")

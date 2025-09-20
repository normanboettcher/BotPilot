from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class CalendarCreationResult:
    success: bool
    error_message: Optional[str] = None

    def is_success(self):
        return self.success

    def get_error_messages(self):
        return self.error_message

    def to_dict(self):
        return asdict(self)

    @staticmethod
    def failure(errors: str):
        return CalendarCreationResult(False, errors)

    @staticmethod
    def success():
        return CalendarCreationResult(True)

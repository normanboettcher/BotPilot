import textwrap
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class BotResponse:
    answer: str
    success: bool
    score: float | None = None
    sender: str | None = None
    buttons: list[dict] | None = None
    accessory: str | None = None
    timestamp: str = field(
        default_factory=lambda: datetime.now().strftime("%d.%m.%Y %H:%M")
    )

    @staticmethod
    def no_answer_found() -> "BotResponse":
        not_found_message = textwrap.dedent(
            """
            Zu dieser Anfrage konnte ich leider keine passende Antwort finden.
            Bitte formulieren Sie Ihre Frage anders.
            """
        ).strip()
        return BotResponse(not_found_message, success=False, sender="bot")

    @staticmethod
    def with_answer_and_buttons(answer: str, buttons: list[dict]) -> "BotResponse":
        return BotResponse(
            answer,
            success=True,
            sender="bot",
            buttons=buttons,
            accessory="buttons",
        )

    @staticmethod
    def with_answer(answer: str) -> "BotResponse":
        return BotResponse(answer, success=True, sender="bot")

    @staticmethod
    def with_calendar(answer: str) -> "BotResponse":
        return BotResponse(answer, success=True, sender="bot", accessory="calendar")

    @staticmethod
    def with_answer_and_score(answer: str, score: float) -> "BotResponse":
        return BotResponse(answer, success=True, score=score, sender="bot")

    def as_dict(self) -> dict:
        return {
            "answer": self.answer,
            "success": self.success,
            "timestamp": self.timestamp,
            "score": self.score,
            "sender": self.sender,
            "buttons": self.buttons,
            "accessory": self.accessory,
        }

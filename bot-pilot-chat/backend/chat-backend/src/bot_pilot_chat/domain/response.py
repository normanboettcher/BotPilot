import textwrap
from datetime import datetime


class BotResponse:

    def __init__(self, answer: str, success: bool, score=None, sender=None):
        self._success = success
        self._timestamp = datetime.now().strftime("%d.%m.%Y %H:%M")
        self._answer = answer
        self._score = score
        self._sender = sender

    def get_answer(self):
        return self._answer

    def get_success(self):
        return self._success

    def get_timestamp(self):
        return self._timestamp

    def get_score(self):
        return self._score

    def get_sender(self):
        return self._sender

    @staticmethod
    def no_answer_found():
        not_found_message = textwrap.dedent(
            """
            Zu dieser Anfrage konnte ich leider keine passende Antwort finden.
            Bitte formulieren Sie Ihre Frage anders.
            """
        ).strip()
        return BotResponse(not_found_message, success=False, sender="bot")

    @staticmethod
    def with_answer(answer: str):
        return BotResponse(answer, success=True, sender="bot")

    @staticmethod
    def with_answer_and_score(answer: str, score: float):
        return BotResponse(answer, success=True, score=score, sender="bot")

    def as_dict(self) -> dict:
        return {
            "answer": self._answer,
            "success": self._success,
            "timestamp": self._timestamp,
            "score": self._score,
            "sender": self._sender,
        }

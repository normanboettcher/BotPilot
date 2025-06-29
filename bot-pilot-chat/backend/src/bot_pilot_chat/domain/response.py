from datetime import datetime


class BotResponse:

    def __init__(self, answer: str, success: bool, score=None):
        self._success = success
        self._timestamp = datetime.now().strftime("%d.%m.%Y, %H:%M")
        self._answer = answer
        self._score = score

    @staticmethod
    def no_answer_found():
        not_found_message = """
            Zu dieser Anfrage konnte ich leider keine passende Antwort finden.
            Bitte formulieren Sie Ihre Frage anders.
            """
        return BotResponse(not_found_message, success=False)

    @staticmethod
    def with_answer(answer: str):
        return BotResponse(answer, success=True)

    @staticmethod
    def with_answer_and_score(answer: str, score: float):
        return BotResponse(answer, success=True, score=score)

    def as_dict(self) -> dict:
        return {
            "answer": self._answer,
            "success": self._success,
            "timestamp": self._timestamp,
            "score": self._score,
        }

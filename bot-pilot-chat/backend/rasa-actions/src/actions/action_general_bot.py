from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionGeneralBot(Action):
    def name(self) -> str:
        return "action_general_bot"

    def run(self, dispatcher, tracker, domain):
        message = (
            "Ich habe eine generelle Frage festgestellt. "
            "Die Implementierung der Antwort folgt bald."
        )
        res = BotResponse.with_answer_and_score(
            message, tracker.latest_message.intent.confidence
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionZeiten(Action):
    def name(self):
        return "action_zeiten"

    def run(self, dispatcher, tracker, domain):
        general_message = (
            "Ich habe das intent Zeiten erkannt. Implementierung folgt."
        )
        res = BotResponse.with_answer_and_score(
            general_message, tracker.latest_message['intent']['confidence']
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

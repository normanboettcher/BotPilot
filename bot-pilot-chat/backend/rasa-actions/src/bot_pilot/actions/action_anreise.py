from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response


class ActionAnreise(Action):
    def name(self):
        return "action_anreise"

    def run(self, dispatcher, tracker, domain):
        general_message = "Ich habe das intent Anreise erkannt. Implementierung folgt."
        res = BotResponse.with_answer_and_score(
            general_message, tracker.latest_message["intent"]["confidence"]
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

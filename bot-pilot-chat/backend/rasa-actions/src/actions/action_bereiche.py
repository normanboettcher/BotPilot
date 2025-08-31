from rasa_sdk import Action

from ..domain.response import BotResponse
from ..utils.response_wrapper import send_response


class ActionBereiche(Action):
    def name(self):
        return "action_bereiche"

    def run(self, dispatcher, tracker, domain):
        general_message = (
            "Ich habe das Intent Bereiche erkannt. Implementierung folgt."
        )
        res = BotResponse.with_answer_and_score(
            general_message, tracker.latest_message["intent"]["confidence"]
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

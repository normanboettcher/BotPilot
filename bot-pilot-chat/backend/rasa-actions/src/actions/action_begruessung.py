from rasa_sdk import Action
from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response


class ActionBegruessung(Action):
    def name(self):
        return "action_begruessung"

    def run(self, dispatcher, tracker, domain):
        res = BotResponse.with_answer_and_score(
            "Hallo, wie kann ich Ihnen helfen?",
            tracker.latest_message["intent"]["confidence"],
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

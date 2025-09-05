from bot_pilot.domain.response import BotResponse
from rasa_sdk import Action

from bot_pilot.utils.response_wrapper import send_response


class ActionNegativeFeedback(Action):
    def name(self):
        return "action_negative_feedback"

    def run(self, dispatcher, tracker, domain):
        general_message = BotResponse.with_answer_and_score(
            "Es tut mir leid, dass ich Ihnen gerade nicht helfen konnte.",
            tracker.latest_message["intent"]["confidence"],
        )
        dispatcher.utter_message(
            json_message=send_response(general_message.as_dict())
        )
        return []

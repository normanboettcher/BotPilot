from typing import Text

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionPositiveFeedback(Action):
    def name(self) -> Text:
        return "action_positive_feedback"

    def run(
            self,
            dispatcher,
            tracker,
            domain,
    ):
        general_message = "Es freut mich, dass ich Ihnen weiterhelfen konnte."
        res = BotResponse.with_answer_and_score(
            general_message, tracker.latest_message['intent']['confidence']
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

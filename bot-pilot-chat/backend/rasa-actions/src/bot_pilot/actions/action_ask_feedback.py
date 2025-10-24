from typing import Text, Dict, Any, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_affirm_deny_buttons
from bot_pilot.utils.response_wrapper import send_response


class ActionAskFeedback(Action):
    def name(self) -> Text:
        return "action_ask_feedback"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        feedback_message = 'Konnte ich Ihnen damit weiterhelfen?'
        affirm_deny = make_affirm_deny_buttons()
        res = BotResponse.with_answer_and_buttons(feedback_message, affirm_deny)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

import logging

from rasa_sdk import Action
from rasa_sdk.events import SlotSet

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionHandleUserNameConfirm(Action):
    def name(self):
        return "action_handle_user_name_confirm"

    def run(self, dispatcher, tracker, domain):
        person_name = next(tracker.get_latest_entity_values("person_name"), None)
        last_intent = tracker.get_intent_of_latest_message()

        if not person_name:
            return []

        if last_intent == "affirm":
            message = f"Perfekt, danke {person_name}!"
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            return [
                SlotSet("user_name", person_name),
                SlotSet("user_name_confirmed", True),
            ]

        elif last_intent == "deny":
            message = "Okay, bitte sag mir deinen Namen nochmal."
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            return [SlotSet("user_name_confirmed", False), SlotSet("user_name", None)]

        return []

import logging

from rasa_sdk import Action
from rasa_sdk.events import SlotSet

logger = logging.getLogger(__name__)


class ActionSwitchForm(Action):
    def name(self):
        return "action_switch_form"

    def run(self, dispatcher, tracker, domain):
        next_form_name = None
        last_action_name = tracker.latest_action_name
        logger.debug(f"observed last action: [{last_action_name}]")
        if last_action_name == "termin_form":
            next_form_name = "user_type_form"
        elif last_action_name == "user_type_form":
            next_form_name = "user_info_form"
        elif last_action_name == "user_info_form":
            next_form_name = "consultant_form"
        return [
            SlotSet("next_form_name", next_form_name),
        ]

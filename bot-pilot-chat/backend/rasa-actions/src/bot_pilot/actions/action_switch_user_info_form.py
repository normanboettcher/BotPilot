import logging

from rasa_sdk import Action
from rasa_sdk.events import SlotSet

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.termin_message_provider import (
    make_termin_from_medium,
)
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionSwitchUserInfoForm(Action):
    def name(self):
        return "action_switch_user_info_form"

    def run(self, dispatcher, tracker, domain):
        logger.debug(f"observed entities: {tracker.slots}")
        message, medium = make_termin_from_medium(tracker)
        termin_type = tracker.get_slot("termin_type")
        user_type = tracker.get_slot("user_type")
        logger.debug("active_form: %s", tracker.active_loop)
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return [
            SlotSet("termin_medium", medium),
            SlotSet("termin_type", termin_type),
            SlotSet("termin_medium_attempts", 0),
            SlotSet("next_form_name", "user_info_form"),
            SlotSet("user_type", user_type),
            SlotSet("user_name", None),
            SlotSet("user_mail", None),
        ]

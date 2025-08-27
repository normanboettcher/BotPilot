import logging

from rasa_sdk import Action
from rasa_sdk.events import SlotSet

from domain.response import BotResponse
from service.provider.termin_message_provider import make_termin_from_medium
from utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionTerminVereinbaren(Action):
    def name(self):
        return "action_termin_vereinbaren"

    def run(self, dispatcher, tracker, domain):
        logger.debug(f"observed entities: {tracker.slots}")
        message, medium = make_termin_from_medium(tracker)
        logger.debug("active_form: %s", tracker.active_loop)
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return [
            SlotSet("termin_medium", None),
            SlotSet("termin_medium_attempts", 0),
        ]

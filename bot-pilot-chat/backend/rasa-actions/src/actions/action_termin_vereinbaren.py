import logging

from bot_pilot_chat.domain.response import BotResponse
from markdown_strings import bold
from rasa_sdk import Action
from rasa_sdk.events import SlotSet

from ..utils.response_wrapper import send_response
from ..utils.entity_utils import map_medium

logger = logging.getLogger(__name__)


class ActionTerminVereinbaren(Action):
    def name(self):
        return "action_termin_vereinbaren"

    def run(self, dispatcher, tracker, domain):
        logger.debug(f"observed entities: {tracker.slots}")
        medium = None
        for entity in tracker.slots:
            if entity == "termin_medium":
                medium = tracker.slots['termin_medium']
        if medium:
            medium = map_medium(medium)
            message = 'Sehr gut, Sie möchten also einen Termin per ' + bold(
                medium) + ' vereinbaren.'
            logger.debug(f"termin_medium: {medium}")
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            return [SlotSet("termin_medium", None)]
        return [SlotSet("termin_medium", None)]

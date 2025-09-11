import logging

from rasa_sdk import Action

logger = logging.Logger(__name__)


class ActionSubmitTermin(Action):
    def name(self) -> str:
        return "action_submit_termin"

    def run(self, dispatcher, tracker, domain):
        slots = ['termin_medium', 'user_type', 'termin_type']

        collected_items = [item for item in slots if
                           tracker.get_slot(item) is not None]

        logger.debug(
            f'Collected items for termin submission: {collected_items}')
        return []

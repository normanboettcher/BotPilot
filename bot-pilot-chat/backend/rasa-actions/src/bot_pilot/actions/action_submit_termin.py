import logging

from rasa_sdk import Action

logger = logging.Logger(__name__)


class ActionSubmitTermin(Action):
    def name(self) -> str:
        return "action_submit_termin"

    def run(self, dispatcher, tracker, domain):
        slots = [
            "termin_medium",
            "user_type",
            "termin_type",
            "user_name",
            "user_mail",
        ]

        collected_items = [
            tracker.get_slot(item) for item in slots if tracker.slots[item] is not None
        ]

        logger.debug(
            "Collected items for termin submission: "
            f"{[print(item) for item in collected_items]}"
        )
        return []

import logging
from typing import Text, List, Any, Dict

from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

logger = logging.getLogger(__name__)


class ValidateTerminForm(FormValidationAction):

    @staticmethod
    def termin_medium_db() -> List[Text]:
        return ["mail", "phone"]

    @staticmethod
    def termin_type_db() -> List[Text]:
        return ["erstberatung", "folgeberatung"]

    def name(self) -> Text:
        return "validate_termin_form"

    def validate_termin_type(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """
        Validate termin_type value.
        Set termin_type value to None if the value is not in the database.
        """
        logger.debug(f"validate termin_type called. slot_value: {slot_value}")
        if slot_value and slot_value.lower() in self.termin_type_db():
            return {
                "termin_type": slot_value.lower(),
            }
        return {
            "termin_type": None,
        }

    def validate_termin_medium(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate termin_medium value."""
        logger.debug(f"validate_termin_form called. slot_value: {slot_value}")
        attempts = tracker.slots.get("termin_medium_attempts")
        if slot_value and slot_value.lower() in self.termin_medium_db():
            # validation succeeded, set the value of the "termin_medium" slot
            # to value
            return {
                "termin_medium": slot_value.lower(),
                "termin_medium_attempts": 0,
            }
        # validation failed, set this slot to None so that the
        # user will be asked for the slot again
        return {
            "termin_medium": None,
            "termin_medium_attempts": attempts + 1 if attempts else 1,
        }

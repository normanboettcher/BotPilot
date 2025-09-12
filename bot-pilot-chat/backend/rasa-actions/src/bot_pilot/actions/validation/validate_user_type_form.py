import logging
from typing import Text, Dict, Any, List

from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

logger = logging.Logger(__name__)


class ValidateUserTypeForm(FormValidationAction):
    """Validates user type form"""

    @staticmethod
    def user_type_db() -> List[Text]:
        return [
            "unternehmer",
            "selbststaendiger",
            "freiberufler",
            "privatperson",
        ]

    def name(self) -> Text:
        return "validate_user_type_form"

    def validate_user_type(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user type value."""
        logger.debug(f"validate_user_type called. slot_value: {slot_value}")
        if not slot_value or not type(slot_value) is str:
            return {"user_type": None}
        if slot_value and slot_value.lower() in self.user_type_db():
            # validation succeeded, set the value of the "user_type" slot
            # to value
            return {"user_type": slot_value.lower()}
        else:
            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {"user_type": None}

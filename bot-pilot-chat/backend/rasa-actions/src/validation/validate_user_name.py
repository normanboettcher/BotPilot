import logging
from typing import Text, List, Any, Dict

from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

logger = logging.getLogger(__name__)


class ValidateUserName(FormValidationAction):

    @staticmethod
    def user_name() -> List[Text]:
        return ["mail", "telefon"]

    def name(self) -> Text:
        return "validate_user_name_form"

    def validate_user_name(
            self,
            slot_value: Any,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user_name value."""
        logger.debug(f'validate_termin_form called. slot_value: {slot_value},'
                     f' slots: {tracker.slots} domain: {domain} tracker: {tracker}')
        if slot_value.lower() in self.user_name():
            # validation succeeded, set the value of the "user_name" slot to value
            return {"user_name": slot_value}
        else:
            # validation failed, set this slot to None so that the
            # user will be asked for the slot again
            return {"user_name": None}

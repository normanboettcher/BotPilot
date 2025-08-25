import logging
from typing import Text, List, Any, Dict

from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

logger = logging.getLogger(__name__)


class ValidateTerminForm(FormValidationAction):

    @staticmethod
    def termin_medium_db() -> List[Text]:
        return ["mail", "telefon"]

    def name(self) -> Text:
        return "validate_termin_form"

    def validate_termin_medium(
            self,
            slot_value: Any,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate termin_medium value."""
        logger.debug(f'validate_termin_form called. slot_value: {slot_value},'
                     f' slots: {tracker.slots} domain: {domain} tracker: {tracker}')
        logger.debug(f'slot value: {slot_value}')
        if slot_value.lower() in self.termin_medium_db():
            # validation succeeded, set the value of the "termin_medium" slot to value
            return {"termin_medium": slot_value}
        else:
            # validation failed, set this slot to None so that the
            # user will be asked for the slot again
            return {"termin_medium": None}

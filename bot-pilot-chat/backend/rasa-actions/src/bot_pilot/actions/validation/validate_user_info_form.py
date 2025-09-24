import logging
from typing import Text, Any, Dict

from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

from bot_pilot.service.validation.user_info_form_validation_service import (
    validate_input_user_name,
    validate_input_user_mail,
)

logger = logging.getLogger(__name__)


class ValidateUserInfoForm(FormValidationAction):

    def name(self) -> Text:
        return "validate_user_info_form"

    def validate_user_name(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """
        Validate user_name value.
        Set user_name value to None if the value is not in the database.
        """
        logger.debug(f"validate user_name called. slot_value: {slot_value}")
        if slot_value and validate_input_user_name(slot_value):
            return {
                "user_name": slot_value.lower(),
            }
        return {
            "user_name": None,
        }

    def validate_user_mail(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user_mail value."""
        logger.debug(
            f"validate_user_info_form called. slot_value: {slot_value}"
        )

        if slot_value and validate_input_user_mail(slot_value):
            # validation succeeded, set the value of the "user_mail" slot
            # to value
            return {"user_mail": slot_value.lower()}
        # validation failed, set this slot to None so that the
        # user will be asked for the slot again
        return {"user_mail": None}

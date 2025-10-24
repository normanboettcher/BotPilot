import logging
from typing import Text, Any, Dict

from markdown_strings import bold
from rasa_sdk import Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_affirm_deny_buttons
from bot_pilot.service.validation.user_info_form_validation_service import (
    validate_input_user_name,
    validate_input_user_mail,
)
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ValidateUserInfoForm(FormValidationAction):

    def name(self) -> Text:
        return "validate_user_info_form"

    def validate_user_name_confirmed(
            self,
            slot_value: Any,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user_name_confirmed value."""
        logger.debug(f"validate_user_info_form called for "
                     f"user_name_confirmed. slot_value: {slot_value}")

        user_name_confirmed = next(
            tracker.get_latest_entity_values("user_name_confirmed"), None)
        person_name = next(tracker.get_latest_entity_values("person_name"), None)

        if person_name is not None and user_name_confirmed is not None:
            if user_name_confirmed == "true" or slot_value == '/affirm':
                return {"user_name_confirmed": True}
            elif user_name_confirmed == "false" or slot_value == '/deny':
                return {"user_name_confirmed": False, "user_name": None}
        return {"user_name_confirmed": None}

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
        logger.debug(
            f"slot value: "
            f"{[item for item in tracker.get_latest_entity_values('person_name')]}"
        )
        person_name = next(tracker.get_latest_entity_values("person_name"), None)
        if person_name is None:
            return {"user_name": None}
        return {"user_name": person_name.lower()}


def validate_user_mail(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
) -> Dict[Text, Any]:
    """Validate user_mail value."""
    logger.debug(f"validate_user_info_form called. slot_value: {slot_value}")

    if slot_value and validate_input_user_mail(slot_value):
        # validation succeeded, set the value of the "user_mail" slot
        # to value
        return {"user_mail": slot_value.lower()}
    # validation failed, set this slot to None so that the
    # user will be asked for the slot again
    return {"user_mail": None}

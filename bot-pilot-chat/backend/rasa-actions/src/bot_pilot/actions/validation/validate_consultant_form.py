from typing import Text, Any, Dict

from rasa_sdk import Tracker, logger
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

from bot_pilot.service.validation.consultant_form_validation_service import (
    validate_input_consultant_name,
)


def validate_consultant_name(
    self,
    slot_value: Any,
    dispatcher: CollectingDispatcher,
    tracker: Tracker,
    domain: DomainDict,
) -> Dict[Text, Any]:
    """
    Validate consultant_name value.
    Set user_name value to None if the value is not in the database.
    """
    logger.debug(f"validate consultant_name called. slot_value: {slot_value}")
    if slot_value and validate_input_consultant_name(slot_value):
        return {
            "consultant_name": slot_value.lower(),
        }
    return {
        "consultant": None,
    }

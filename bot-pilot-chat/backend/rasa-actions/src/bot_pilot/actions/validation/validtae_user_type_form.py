from typing import Text, Dict, Any, List

from rasa_sdk import FormValidationAction


class ValidateUserTypeForm(FormValidationAction):
    """Validates user type form"""

    @staticmethod
    def user_type_db() -> List[Text]:
        return ["unternehmer", "selbststaendiger", "freiberufler",
                "privatperson"]

    def validate_user_type(
            self,
            slot_value: str,
    ) -> Dict[Text, Any]:
        """Validate user type value."""

        if slot_value and slot_value.lower() in self.user_type_db():
            # validation succeeded, set the value of the "user_type" slot
            # to value
            return {"user_type": slot_value}
        else:
            # validation failed, set this slot to None, meaning the
            # user will be asked for the slot again
            return {"user_type": None}

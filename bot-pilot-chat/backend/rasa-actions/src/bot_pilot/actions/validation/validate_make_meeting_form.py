from rasa_sdk import FormValidationAction

from bot_pilot.service.validation.meeting_datetime_validator import is_utc_datetime


class ValidateMakeMeetingForm(FormValidationAction):
    def name(self):
        return "validate_make_meeting_form"

    def validate_meeting_datetime(self, slot_value, dispatcher, tracker, domain):
        if is_utc_datetime(slot_value):
            return {"meeting_datetime": slot_value}
        return {"meeting_datetime": None}

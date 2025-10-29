import logging

from markdown_strings import bold
from rasa_sdk import Action

from bot_pilot.actions.utils.slot_utils import meeting_date_from_slot_value, clear_slots
from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionSubmitMakeMeetingForm(Action):
    def name(self) -> str:
        return "action_submit_make_meeting_form"

    def run(self, dispatcher, tracker, domain):
        collected_slots = [
            "termin_type",
            "user_type",
            "user_name",
            "user_mail",
            "meeting_datetime",
            "consultant_name",
        ]
        logger.debug(
            f"{['slot:' + tracker.get_slot(slot) for slot in collected_slots]}"
        )
        meeting_datetime = tracker.get_slot("meeting_datetime")
        user_name = tracker.get_slot("user_name")
        user_mail = tracker.get_slot("user_mail")
        formatted_meeting_datetime = meeting_date_from_slot_value(meeting_datetime)
        message = f"""
        Vielen Dank! Ich habe Ihnen einen Termin am {bold(formatted_meeting_datetime)}
        Uhr eingestellt.
        Für den Kunden: {bold(user_name)}.
        Zur Verifizierung verwendet: {bold(user_mail)}.
        """.strip()
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        cleared_slots = clear_slots(collected_slots)
        logger.debug(f"cleared slots: [{cleared_slots}]")
        return cleared_slots

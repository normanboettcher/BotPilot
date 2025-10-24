import logging

from markdown_strings import bold
from rasa.shared.core.events import FollowupAction, SlotSet
from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)

collected_slots = ['termin_type', 'user_type', 'user_name', 'user_mail',
                   'meeting_datetime']


class ActionSubmitMakeMeetingForm(Action):
    def name(self) -> str:
        return "action_submit_make_meeting_form"

    def run(self, dispatcher, tracker, domain):
        logger.debug(
            f"{['slot:' + tracker.get_slot(slot) for slot in collected_slots]}")
        meeting_datetime = tracker.get_slot("meeting_datetime")
        user_name = tracker.get_slot("user_name")
        user_mail = tracker.get_slot("user_mail")
        formatted_meeting_datetime = meeting_datetime.strftime("%d.%m.%Y um %H:%M")
        message = f"""
        Vielen Dank! Ich habe Ihnen einen Termin am {bold(formatted_meeting_datetime)}
        eingestellt.
        Für den Kunde: {bold(user_name)}. Zur Verifizierung verwendet: {bold(user_mail)}.
        """.strip()
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        cleared_slots = [SlotSet(slot, None) for slot in collected_slots]
        return [FollowupAction("action_ask_feedback"), *cleared_slots]

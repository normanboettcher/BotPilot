import logging

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from rasa_sdk.events import SlotSet, FollowupAction

from ..utils.response_wrapper import send_response
from markdown_strings import bold

logger = logging.getLogger(__name__)


class ActionAskTerminMedium(Action):
    def name(self):
        return "action_ask_termin_medium"

    def run(self, dispatcher, tracker, domain):
        attempts = tracker.slots.get("termin_medium_attempts")
        if attempts == 3:
            logger.debug("Max attempts reached for termin_medium")
            return [
                SlotSet("termin_medium_attempts", 0),
                SlotSet("termin_medium", None),
                FollowupAction('action_ask_continue')
            ]
        message = (
            "Möchten Sie einen Termin klassisch über Telefon oder E-Mail "
            "vereinbaren oder möchten Sie das direkt mit mir machen? Antworten "
            f"Sie dafür einfach mit {bold(bot)} auf diese Frage."
        )
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

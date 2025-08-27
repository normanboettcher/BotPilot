import logging

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from rasa_sdk.events import SlotSet

from ..utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionAskTerminMedium(Action):
    def name(self):
        return "action_ask_termin_medium"

    def run(self, dispatcher, tracker, domain):
        attempts = tracker.slots.get("termin_medium_attempts")
        if attempts == 3:
            logger.debug("Max attempts reached for termin_medium")
            message = (
                "Leider konnte ich Sie nicht verstehen. "
                "Möchten Sie es weiter versuchen oder wollen Sie den Vorgang "
                "abbrechen ?"
            )
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            return [SlotSet("termin_medium_attempts", 0),
                    SlotSet("termin_medium", None)]
        message = (
            "Welchen Medien wollen Sie benutzen, um Ihnen einen "
            "Termin zu bestimmen? Email oder Telefon?"
        )
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

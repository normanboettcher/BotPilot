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
        logger.debug("attempts: %s", attempts)
        if attempts == 0:
            message = (
                "Welchen Medien wollen Sie benutzen, um Ihnen einen "
                "Termin zu bestimmen? Email oder Telefon?"
            )
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            return [SlotSet("termin_medium_attempts", 1)]
        if 3 > attempts > 0:
            message = (
                "Es tut mir leid, ich konnte leider nicht verstehen, "
                "ob Sie über E-Mail oder Telefon einen Termin "
                "anfragen wollen."
            )
            res = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            logger.debug("set attempt + 1")
            return [SlotSet("termin_medium_attempts", attempts + 1)]
        else:
            fail_message = (
                "Es tut mir leid, dass ich Ihre Anfrage gerade "
                "nicht verarbeiten konnte."
            )
            res = BotResponse.with_answer(fail_message)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
            logger.debug("too many attempts. reset")
            return [SlotSet("termin_medium_attempts", 0)]

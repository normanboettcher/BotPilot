import logging

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionTermin(Action):
    def name(self):
        return "action_termin"

    def run(self, dispatcher, tracker, domain):
        logger.debug(f"observed entities: {tracker.latest_message['entities']}")
        logger.debug(f"latest message: {tracker.latest_message}")
        general_message = (
            "Ich habe das intent Termin erkannt. Implementierung folgt."
        )
        res = BotResponse.with_answer_and_score(
            general_message, tracker.latest_message["intent"]["confidence"]
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

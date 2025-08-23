import logging

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from rasa_sdk.events import UserUtteranceReverted

from ..utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        response = BotResponse.no_answer_found()
        logger.debug("calling default callback")
        logger.debug(f"slots: {tracker.slots}")
        dispatcher.utter_message(json_message=send_response(response.as_dict()))
        return [UserUtteranceReverted()]

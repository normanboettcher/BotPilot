from bot_pilot.domain.response import BotResponse
from rasa_sdk import Action
from markdown_strings import bold
import logging

from bot_pilot.service.provider.button_factory import make_affirm_deny_buttons
from bot_pilot.utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionAskContinue(Action):
    def name(self):
        return "action_ask_continue"

    async def run(self, dispatcher, tracker, domain):
        logger.debug("Asking user to continue or abort")
        message = f"Möchten Sie den Prozess forsetzen? " f'{bold("ja/nein")}'
        buttons = make_affirm_deny_buttons()
        res = BotResponse.with_answer_and_buttons(message, buttons)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

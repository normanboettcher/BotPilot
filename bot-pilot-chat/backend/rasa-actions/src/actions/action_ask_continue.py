from ..domain.response import BotResponse
from rasa_sdk import Action
from markdown_strings import bold
import logging
from rasa_sdk.events import ActiveLoop

from ..utils.response_wrapper import send_response

logger = logging.getLogger(__name__)


class ActionAskContinue(Action):
    def name(self):
        return "action_ask_continue"

    async def run(self, dispatcher, tracker, domain):
        logger.debug("Asking user to continue or abort")
        res = BotResponse.with_answer(
            f"Möchten Sie den Prozess forsetzen? " f'{bold("ja/nein")}'
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return [ActiveLoop(None)]

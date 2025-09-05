import logging

from rasa_sdk import Action
from rasa_sdk.events import SlotSet, FollowupAction

from bot_pilot.domain.button_registry import TERMIN_MEDIUMS
from bot_pilot.service.provider.button_factory import make_button
from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response

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
                FollowupAction("action_ask_continue"),
            ]
        buttons = [
            make_button("termin_medium_inform", "termin_medium", value)
            for (key, value) in TERMIN_MEDIUMS
        ]
        message = (
            "Möchten Sie einen Termin klassisch über Telefon oder E-Mail "
            "vereinbaren oder möchten Sie das direkt mit mir machen?"
        )
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(
            json_message=send_response(res.as_dict()), buttons=buttons
        )
        return []

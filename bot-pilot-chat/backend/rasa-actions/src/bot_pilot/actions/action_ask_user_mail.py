from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_buttons_termin_types
from bot_pilot.utils.response_wrapper import send_response


class ActionAskUserMail(Action):
    def name(self) -> str:
        return "action_ask_user_mail"

    def run(self, dispatcher, tracker, domain):
        message = (
            "Bitte geben Sie Ihre E-Mail-Adresse ein."
        )
        response = BotResponse.with_answer(message)
        dispatcher.utter_message(
            json_message=send_response(response.as_dict())
        )
        return []

from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_buttons_tax_consultant
from bot_pilot.utils.response_wrapper import send_response


class ActionAskConsultant(Action):
    def name(self):
        return "action_ask_consultant"

    def run(self, dispatcher, tracker, domain):
        message = "Bitte wählen Sie Ihren Berater aus."

        buttons = make_buttons_tax_consultant("default")

        res = BotResponse.with_answer_and_buttons(message, buttons)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

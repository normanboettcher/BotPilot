from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_buttons_tax_consultant


class ActionAskConsultant(Action):
    def name(self):
        return "action_ask_consultant"

    def run(self, dispatcher, tracker, domain):
        message = "Bitte wählen Sie Ihren Berater aus."

        res = BotResponse.with_answer(message)

        buttons = make_buttons_tax_consultant("default")

from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionUnterlagen(Action):
    def name(self):
        return "action_unterlagen"

    def run(self, dispatcher, tracker, domain):
        return []

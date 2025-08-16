from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response
class ActionSteuerberatung(Action):
  def name(self):
    return 'action_steuerberatung'
  def run(self, dispatcher, tracker, domain):
    return []

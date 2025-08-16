from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response
class ActionZeiten(Action):
  def name(self):
    return 'action_zeiten'
  def run(self, dispatcher, tracker, domain):
    return []

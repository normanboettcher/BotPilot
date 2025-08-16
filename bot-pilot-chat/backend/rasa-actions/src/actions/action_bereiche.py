from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response
class ActionBereiche(Action):
  def name(self):
    return 'action_bereiche'
  def run(self, dispatcher, tracker, domain):
    return []

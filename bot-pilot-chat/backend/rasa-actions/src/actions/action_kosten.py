from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response
class ActionKosten(Action):
  def name(self):
    return 'action_kosten'
  def run(self, dispatcher, tracker, domain):
    return []

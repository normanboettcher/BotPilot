from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action


class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        response = BotResponse.no_answer_found()
        dispatcher.utter_message(json_message={'data': { 'response': response.as_dict()}})
        return []

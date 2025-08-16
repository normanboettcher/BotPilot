import requests
from bot_pilot_chat.domain.response import BotResponse
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionGetFaq(Action):
    def name(self):
        return "action_get_faq"

    def run(self, dispatcher, tracker, domain):
        try:
            faq = requests.post('http://localhost:8000/api/faqs',
                                json={'question': tracker.latest_message.get('text', '')})
            dispatcher.utter_message(json_message=send_response(faq.json()))
        except Exception as e:
            message = BotResponse.with_answer("Es tut mir leid, ich konnte die Antwort zu dieser Frage gerade nicht abrufen. Bitte versuchen Sie es später erneut.")
            dispatcher.utter_message(json_message=send_response(message.as_dict()))

        return []

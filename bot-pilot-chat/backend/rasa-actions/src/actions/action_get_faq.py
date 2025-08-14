import requests
from rasa_sdk import Action


class ActionGetFaq(Action):
    def name(self):
        return "action_get_faq"

    def run(self, dispatcher, tracker, domain):
        try:
            faq = requests.post('http://localhost:8000/api/faqs',
                                json={'question': tracker.latest_message.get('text', '')})
            dispatcher.utter_message(json_message={'data': {'response': faq.json()}})
        except Exception as e:
            print('Fehler:', e)
            dispatcher.utter_message(
                "Es tut mir leid, ich konnte die Antwort zu dieser Frage gerade nicht abrufen. Bitte versuchen Sie es später erneut.")

        return []

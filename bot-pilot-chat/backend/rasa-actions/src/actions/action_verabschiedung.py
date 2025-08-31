from domain.response import BotResponse
from rasa_sdk import Action
from utils.response_wrapper import send_response


class ActionVerabschiedung(Action):
    def name(self) -> str:
        return "action_verabschiedung"

    def run(self, dispatcher, tracker, domain):
        res = BotResponse.with_answer("auf Wiedersehen! Bis zum nächstem Mal.")
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

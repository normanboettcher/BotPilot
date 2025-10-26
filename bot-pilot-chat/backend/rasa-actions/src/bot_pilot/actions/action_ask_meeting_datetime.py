from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response


class ActionAskMeetingDatetime(Action):
    def name(self) -> str:
        return "action_ask_meeting_datetime"

    def run(self, dispatcher, tracker, domain):
        message = "Bitte wählen Sie ein Datum und eine Uhrzeit aus dem " "Kalender aus."
        res = BotResponse.with_calendar(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

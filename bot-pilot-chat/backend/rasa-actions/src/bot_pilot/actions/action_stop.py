from rasa_sdk import Action
from rasa_sdk.events import FollowupAction

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response


class ActionStop(Action):
    def name(self) -> str:
        return "action_stop"

    def run(self, dispatcher, tracker, domain):
        message = "Ich habe verstanden, dass Sie den Prozess beendet möchten."
        res = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return [FollowupAction("action_ask_continue")]

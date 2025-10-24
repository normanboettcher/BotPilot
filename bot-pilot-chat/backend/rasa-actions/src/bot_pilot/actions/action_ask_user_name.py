from markdown_strings import bold
from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.utils.response_wrapper import send_response


class ActionAskUserName(Action):
    def name(self) -> str:
        return "action_ask_user_name"

    def run(self, dispatcher, tracker, domain):
        message = (
            "Bitte geben Sie Ihren Vor- und Nachnamen ein. "
            "Damit ich es besser verstehen kann, bspw. in der folgenden Form: "
            f"{bold('Mein Name ist Vorname Nachname')}"
        )
        response = BotResponse.with_answer(message)
        dispatcher.utter_message(json_message=send_response(response.as_dict()))
        return []

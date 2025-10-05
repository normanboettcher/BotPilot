from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_buttons_termin_types
from bot_pilot.utils.response_wrapper import send_response


class ActionAskTerminType(Action):
    def name(self) -> str:
        return "action_ask_termin_type"

    def run(self, dispatcher, tracker, domain):
        message = (
            "Sind Sie bereits Kunde oder ist es Ihr erster Termin bei uns?"
        )
        buttons = make_buttons_termin_types()
        response = BotResponse(message, True, None, 'bot',
                               buttons)
        dispatcher.utter_message(json_message=send_response(response.as_dict()))
        return []

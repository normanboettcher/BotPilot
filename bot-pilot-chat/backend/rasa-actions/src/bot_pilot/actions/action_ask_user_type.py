from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_buttons_user_types
from bot_pilot.utils.response_wrapper import send_response


class ActionAskUserType(Action):
    def name(self) -> str:
        return "action_ask_user_type"

    def run(self, dispatcher, tracker, domain):
        message = 'Welcher Kategorie würden Sie sich am ehesten zuordnen?'
        res = BotResponse.with_answer(message)
        buttons = make_buttons_user_types()
        dispatcher.utter_message(json_message=send_response(res.as_dict()),
                                 buttons=buttons)
        return []

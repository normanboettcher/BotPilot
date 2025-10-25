from markdown_strings import bold
from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_affirm_deny_buttons
from bot_pilot.utils.response_wrapper import send_response


class ActionAskUserNameConfirmed(Action):
    def name(self) -> str:
        return "action_ask_user_name_confirmed"

    def run(self, dispatcher, tracker, domain):
        person_name = next(tracker.get_latest_entity_values("person_name"), None)
        if person_name is not None:
            message = (
                f"Ich habe den Namen {bold(person_name)} verstanden."
                f"Ist das korrekt?"
            )
            buttons = make_affirm_deny_buttons()
            res = BotResponse.with_answer_and_buttons(message, buttons)
            dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

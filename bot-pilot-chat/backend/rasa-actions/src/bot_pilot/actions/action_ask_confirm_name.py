from markdown_strings import bold
from rasa_sdk import Action

from bot_pilot.domain.response import BotResponse
from bot_pilot.service.provider.button_factory import make_affirm_deny_buttons
from bot_pilot.utils.response_wrapper import send_response


class ActionAskConfirmName(Action):
    def name(self):
        return "action_ask_confirm_name"

    def run(self, dispatcher, tracker, domain):
        last_entities = tracker.get_latest_entity_values("person_name")
        observed_name = None
        for entity in last_entities:
            observed_name = entity
            break
        if observed_name is not None:
            message = (
                f"Ich habe den Namen {bold(observed_name)} verstanden."
                f"Ist das korrekt?"
            )
            buttons = make_affirm_deny_buttons()
            response = BotResponse.with_answer_and_buttons(message, buttons)
            dispatcher.utter_message(json_message=send_response(response.as_dict()))
        else:
            message = (
                "Leider konnte ich den Namen noch nicht verstehen."
                "Bitte versuche es noch einmal"
            )
            response = BotResponse.with_answer(message)
            dispatcher.utter_message(json_message=send_response(response.as_dict()))
        return []

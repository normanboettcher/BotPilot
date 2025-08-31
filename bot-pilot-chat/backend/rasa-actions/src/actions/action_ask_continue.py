from domain.response import BotResponse
from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from markdown_strings import bold

from ..utils.response_wrapper import send_response


class ActionAskContinue(Action):
    def name(self) -> Text:
        return "action_ask_continue"

    async def run(
            self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        res = BotResponse.with_answer(f'Möchten Sie den Prozess '
                                      f'{bold("fortsetzen")} oder lieber '
                                      f'{bold("abbrechen")}?')
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

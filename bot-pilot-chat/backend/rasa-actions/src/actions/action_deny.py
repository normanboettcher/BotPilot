from bot_pilot.domain.response import BotResponse
from rasa_sdk import Action
from bot_pilot.utils.response_wrapper import send_response


class ActionDeny(Action):
    def name(self) -> str:
        return "action_deny"

    async def run(self, dispatcher, tracker, domain):
        res = BotResponse.with_answer(
            "Schade, dass Sie den Prozess beenden "
            "möchten. Sagen Sie mir gerne Bescheid, "
            "wenn Sie es noch einmal versuchen "
            "möchten."
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

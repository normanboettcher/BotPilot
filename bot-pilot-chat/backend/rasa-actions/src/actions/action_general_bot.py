import textwrap

import emoji
from aiogram.utils.markdown import italic
from bot_pilot_chat.domain.response import BotResponse
from markdown_strings import unordered_list, bold
from rasa_sdk import Action
from ..utils.response_wrapper import send_response


class ActionGeneralBot(Action):
    def name(self) -> str:
        return "action_general_bot"

    def run(self, dispatcher, tracker, domain):
        feature_list = unordered_list(
            [
                "Terminabstimmung",
                "Fragen zur Anreise",
                "Anfragen zu Kosten",
                "Anfragen zur Steuererklaerungen",
                "Anfragen zu Steuerberatungen",
            ]
        )
        digitaler_assistent = "_digitaler Assistent_"
        kanzlei_name = bold("Musterpartner")
        message = textwrap.dedent(
            f"Als {digitaler_assistent} der Kanzlei {kanzlei_name} helfe ich "
            f"Ihnen bei den folgenden Themen: {emoji.emojize(':clipboard:')} \n"
            f"{feature_list} \n \n"
            f"Mit welchen Themen sollen wir starten?"
        ).strip()
        res = BotResponse.with_answer_and_score(
            message, tracker.latest_message['intent']['confidence']
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))

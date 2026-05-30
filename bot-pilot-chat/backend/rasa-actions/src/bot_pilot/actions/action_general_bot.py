import textwrap

import emoji
from markdown_strings import unordered_list, bold
from rasa_sdk import Action

from bot_pilot.adapters.hardcoded_tenant_config_adapter import (
    HardcodedTenantConfigAdapter,
)
from bot_pilot.domain.response import BotResponse
from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.utils.response_wrapper import send_response


class ActionGeneralBot(Action):
    def name(self) -> str:
        return "action_general_bot"

    def run(self, dispatcher, tracker, domain):
        context = TenantContext(tenant_id="default")
        firm_name = HardcodedTenantConfigAdapter().get_firm_name(context)

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
        kanzlei_name = bold(firm_name)
        message = textwrap.dedent(
            f"Als {digitaler_assistent} der Kanzlei {kanzlei_name} helfe ich "
            f"Ihnen bei den folgenden Themen: {emoji.emojize(':clipboard:')} "
            f"\n"
            f"{feature_list} \n \n"
            f"Mit welchen Themen sollen wir starten?"
        ).strip()
        res = BotResponse.with_answer_and_score(
            message, tracker.latest_message["intent"]["confidence"]
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))

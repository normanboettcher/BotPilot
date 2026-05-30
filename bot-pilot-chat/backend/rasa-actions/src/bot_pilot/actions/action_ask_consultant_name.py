from rasa_sdk import Action

from bot_pilot.adapters.hardcoded_consultant_adapter import HardcodedConsultantAdapter
from bot_pilot.domain.response import BotResponse
from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.service.provider.button_factory import make_buttons_tax_consultant
from bot_pilot.utils.response_wrapper import send_response


class ActionAskConsultant(Action):
    def name(self) -> str:
        return "action_ask_consultant_name"

    def run(self, dispatcher, tracker, domain):
        context = TenantContext(tenant_id="default")
        consultants = HardcodedConsultantAdapter().find_all(context)
        buttons = make_buttons_tax_consultant(consultants)
        res = BotResponse.with_answer_and_buttons(
            "Bitte wählen Sie Ihren Berater aus.", buttons
        )
        dispatcher.utter_message(json_message=send_response(res.as_dict()))
        return []

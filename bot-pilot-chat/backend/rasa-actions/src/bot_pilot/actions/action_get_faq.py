from rasa_sdk import Action

from bot_pilot.adapters.http_faq_adapter import HttpFaqAdapter
from bot_pilot.config.config import AppConfig
from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.ports.faq_port import FaqPort
from bot_pilot.utils.response_wrapper import send_response


class ActionGetFaq(Action):
    def __init__(self) -> None:
        config = AppConfig.from_env()
        self._faq_port: FaqPort = HttpFaqAdapter(config.faq_service_url)

    def name(self) -> str:
        return "action_get_faq"

    def run(self, dispatcher, tracker, domain):
        context = TenantContext(tenant_id="default")
        response = self._faq_port.find_answer(
            tracker.latest_message.get("text", ""), context
        )
        dispatcher.utter_message(json_message=send_response(response.as_dict()))
        return []

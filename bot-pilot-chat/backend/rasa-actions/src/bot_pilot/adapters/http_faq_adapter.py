import requests

from bot_pilot.domain.response import BotResponse
from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.ports.faq_port import FaqPort


class HttpFaqAdapter(FaqPort):
    def __init__(self, faq_service_url: str) -> None:
        self._url = faq_service_url

    def find_answer(self, question: str, context: TenantContext) -> BotResponse:
        try:
            response = requests.post(self._url, json={"question": question})
            data = response.json()
            return BotResponse(
                answer=data.get("answer", ""),
                success=data.get("success", True),
                score=data.get("score"),
                sender=data.get("sender"),
                buttons=data.get("buttons"),
                accessory=data.get("accessory"),
            )
        except Exception:
            return BotResponse.with_answer(
                "Es tut mir leid, ich konnte die Antwort zu dieser Frage "
                "gerade nicht abrufen. "
                "Bitte versuchen Sie es später erneut."
            )

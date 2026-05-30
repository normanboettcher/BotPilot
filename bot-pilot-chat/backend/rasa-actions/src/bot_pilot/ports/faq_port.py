from abc import ABC, abstractmethod

from bot_pilot.domain.response import BotResponse
from bot_pilot.domain.tenant_context import TenantContext


class FaqPort(ABC):
    @abstractmethod
    def find_answer(self, question: str, context: TenantContext) -> BotResponse: ...

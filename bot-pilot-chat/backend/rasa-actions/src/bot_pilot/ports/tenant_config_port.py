from abc import ABC, abstractmethod

from bot_pilot.domain.tenant_context import TenantContext


class TenantConfigPort(ABC):
    @abstractmethod
    def get_firm_name(self, context: TenantContext) -> str: ...

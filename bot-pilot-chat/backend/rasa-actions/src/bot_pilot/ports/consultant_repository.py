from abc import ABC, abstractmethod

from bot_pilot.domain.tax_consultant import TaxConsultant
from bot_pilot.domain.tenant_context import TenantContext


class ConsultantRepository(ABC):
    @abstractmethod
    def find_all(self, context: TenantContext) -> list[TaxConsultant]: ...

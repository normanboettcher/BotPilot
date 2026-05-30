from bot_pilot.domain.tax_consultant import TaxConsultant
from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.ports.consultant_repository import ConsultantRepository

# Hardcoded for now — replace with DB lookup keyed by context.tenant_id
_CONSULTANTS = [
    TaxConsultant("1", "Meyer", "Peter"),
    TaxConsultant("2", "Schmidt", "Oliver"),
    TaxConsultant("3", "Müller", "Stefanie"),
]


class HardcodedConsultantAdapter(ConsultantRepository):
    def find_all(self, context: TenantContext) -> list[TaxConsultant]:
        return _CONSULTANTS

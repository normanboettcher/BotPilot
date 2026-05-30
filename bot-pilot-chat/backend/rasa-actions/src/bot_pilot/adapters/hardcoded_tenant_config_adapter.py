from bot_pilot.domain.tenant_context import TenantContext
from bot_pilot.ports.tenant_config_port import TenantConfigPort


class HardcodedTenantConfigAdapter(TenantConfigPort):
    def get_firm_name(self, context: TenantContext) -> str:
        return "Musterpartner"

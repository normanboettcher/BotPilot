from bot_pilot.adapters.hardcoded_consultant_adapter import HardcodedConsultantAdapter
from bot_pilot.domain.tax_consultant import TaxConsultant
from bot_pilot.domain.tenant_context import TenantContext

_CONTEXT = TenantContext(tenant_id="default")


def test_find_all_returns_non_empty_list():
    adapter = HardcodedConsultantAdapter()
    result = adapter.find_all(_CONTEXT)
    assert len(result) > 0


def test_find_all_returns_tax_consultant_instances():
    adapter = HardcodedConsultantAdapter()
    result = adapter.find_all(_CONTEXT)
    for item in result:
        assert isinstance(item, TaxConsultant)

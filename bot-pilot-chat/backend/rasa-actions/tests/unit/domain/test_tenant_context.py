import pytest
from dataclasses import FrozenInstanceError

from bot_pilot.domain.tenant_context import TenantContext


def test_tenant_context_is_frozen():
    ctx = TenantContext(tenant_id="default")
    with pytest.raises(FrozenInstanceError):
        ctx.tenant_id = "other"  # type: ignore[misc]


def test_tenant_context_equality():
    assert TenantContext(tenant_id="acme") == TenantContext(tenant_id="acme")


def test_tenant_context_inequality():
    assert TenantContext(tenant_id="acme") != TenantContext(tenant_id="other")

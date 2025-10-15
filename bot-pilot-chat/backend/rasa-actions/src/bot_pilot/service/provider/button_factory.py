from bot_pilot.domain.button_option import ButtonOption
from bot_pilot.domain.tax_consultant import TaxConsultant
from bot_pilot.service.provider.consultant_provider_service import get_consultant


def make_buttons_termin_mediums() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_MEDIUMS

    return [button.render() for (key, button) in TERMIN_MEDIUMS.items()]


def make_buttons_termin_types() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_TYPES

    return [button.render() for (key, button) in TERMIN_TYPES.items()]


def make_buttons_user_types() -> list[dict]:
    from bot_pilot.domain.button_registry import USER_TYPES

    return [button.render() for (key, button) in USER_TYPES.items()]


def make_buttons_tax_consultant(customer_id: str) -> list[dict]:
    tax_consultants = get_consultant(customer_id)

    def make_consultant_button(c: TaxConsultant):
        name = f"{c.tax_consultant_firstname} {c.tax_consultant_lastname}"
        payload = "/consultant_inform{" f'"consultant_name":"{name}"' + "}"
        return ButtonOption(name, payload, emoji=":consultant:")

    return [
        make_consultant_button(value).render()
        for (key, value) in tax_consultants.items()
    ]


def make_affirm_deny_buttons() -> list[dict]:
    from bot_pilot.domain.button_registry import AFFIRM_DENY

    return [button.render() for (key, button) in AFFIRM_DENY.items()]

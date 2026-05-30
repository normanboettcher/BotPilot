from bot_pilot.domain.button_option import ButtonOption
from bot_pilot.domain.tax_consultant import TaxConsultant


def make_buttons_termin_mediums() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_MEDIUMS

    return [button.render() for (key, button) in TERMIN_MEDIUMS.items()]


def make_buttons_termin_types() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_TYPES

    return [button.render() for (key, button) in TERMIN_TYPES.items()]


def make_buttons_user_types() -> list[dict]:
    from bot_pilot.domain.button_registry import USER_TYPES

    return [button.render() for (key, button) in USER_TYPES.items()]


def make_buttons_tax_consultant(consultants: list[TaxConsultant]) -> list[dict]:
    def make_consultant_button(c: TaxConsultant) -> ButtonOption:
        name = f"{c.tax_consultant_firstname} {c.tax_consultant_lastname}"
        payload = '/consultant_inform{"person_name":' + f'"{name}"' + "}"
        return ButtonOption(name, payload, emoji=":consultant:")

    return [make_consultant_button(c).render() for c in consultants]


def make_affirm_deny_buttons() -> list[dict]:
    from bot_pilot.domain.button_registry import AFFIRM_DENY

    return [button.render() for (key, button) in AFFIRM_DENY.items()]

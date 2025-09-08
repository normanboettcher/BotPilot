def make_buttons_termin_mediums() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_MEDIUMS

    return [button.render() for (key, button) in TERMIN_MEDIUMS.items()]


def make_buttons_termin_types() -> list[dict]:
    from bot_pilot.domain.button_registry import TERMIN_TYPES

    return [button.render() for (key, button) in TERMIN_TYPES.items()]


def make_buttons_user_types() -> list[dict]:
    from bot_pilot.domain.button_registry import USER_TYPES

    return [button.render() for (key, button) in USER_TYPES.items()]

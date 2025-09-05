from bot_pilot.domain.button_registry import TERMIN_MEDIUMS


def make_buttons_termin_mediums() -> list[dict]:
    return [button.render() for (key, button) in TERMIN_MEDIUMS.items()]

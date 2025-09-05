import emoji

from bot_pilot.domain.button_registry import TERMIN_MEDIUMS


def make_button(
    intent: str, entity_name: str, value: str, button_collection: dict
) -> dict:
    option = button_collection[value]
    return {
        "title": f"{emoji.emojize(option['emoji'])} " f"{option['title']}",
        "payload": f'/{intent}{{"{entity_name}": "{value}"}}',
    }


def make_buttons_termin_mediums() -> list[dict]:
    return [
        make_button(
            "termin_medium_inform", "termin_medium", value, TERMIN_MEDIUMS
        )
        for value in TERMIN_MEDIUMS
    ]

import emoji

from bot_pilot.domain.button_option import ButtonOption

TERMIN_MEDIUMS: dict[str, ButtonOption] = {
    "mail": ButtonOption(
        "E-Mail",
        '/termin_medium_inform{"termin_medium": "mail"}',
        f'{emoji.emojize(":email:")}',
    ),
    "phone": ButtonOption(
        "Telefon",
        '/termin_medium_inform{"termin_medium": "phone"}',
        f'{emoji.emojize(":telephone_receiver:")}',
    ),
    "bot": ButtonOption(
        "Erledige du das",
        '/termin_medium_inform{"termin_medium": "bot"}',
        f'{emoji.emojize(":smiling_face_with_smiling_eyes:")}',
    ),
}

TERMIN_TYPES: dict[str, ButtonOption] = {
    "erstberatung": ButtonOption(
        "Erstberatung",
        '/termin_type_inform{"termin_type": "erstberatung"}',
        f'{emoji.emojize(":new:")}',
    ),
    'folgeberatung': ButtonOption(
        "Folgeberatung",
        '/termin_type_inform{"termin_type": "folgeberatung"}',
        f'{emoji.emojize(":right_arrow:")}',
    )
}

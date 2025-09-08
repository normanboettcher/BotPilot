import emoji

from bot_pilot.domain.button_option import ButtonOption

TERMIN_MEDIUMS: dict[str, ButtonOption] = {
    "mail": ButtonOption(
        "E-Mail",
        '/termin_medium_inform{"termin_medium": "mail"}',
        f'{emoji.emojize(":e-mail:")}',
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
        f'{emoji.emojize(":NEW_button:")}',
    ),
    "folgeberatung": ButtonOption(
        "Folgeberatung",
        '/termin_type_inform{"termin_type": "folgeberatung"}',
        f'{emoji.emojize(":right_arrow:")}',
    ),
}

USER_TYPES: dict[str, ButtonOption] = {
    "privatperson": ButtonOption(
        "Privatperson",
        '/user_type_inform{"user_type": "privatperson"}',
        f'{emoji.emojize(":man_light_skin_tone_blond_hair:")}',
    ),
    "freiberufler": ButtonOption(
        "Freiberufler",
        '/user_type_inform{"user_type": "freiberufler"}',
        f'{emoji.emojize(":briefcase:")}',
    ),
    "unternehmen": ButtonOption(
        "Unternehmer",
        '/user_type_inform{"user_type": "unternehmer"}',
        f'{emoji.emojize(":office_building:")}',
    ),
    "selbststaendiger": ButtonOption(
        "Selbstständiger",
        '/user_type_inform{"user_type": "selbstaendiger"}',
        f'{emoji.emojize(":handshake:")}',
    ),
}

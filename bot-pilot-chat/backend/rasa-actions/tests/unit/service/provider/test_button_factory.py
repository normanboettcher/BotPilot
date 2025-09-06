from bot_pilot.service.provider.button_factory import (
    make_buttons_termin_mediums, make_buttons_termin_types,
)


def test_make_buttons_termin_mediums():
    buttons = make_buttons_termin_mediums()
    assert buttons == [
        {
            "title": ":email: E-Mail",
            "payload": '/termin_medium_inform{"termin_medium": "mail"}',
        },
        {
            "title": "📞 Telefon",
            "payload": '/termin_medium_inform{"termin_medium": "phone"}',
        },
        {
            "title": "😊 Erledige du das",
            "payload": '/termin_medium_inform{"termin_medium": "bot"}',
        },
    ]


def test_make_buttons_termin_type():
    buttons = make_buttons_termin_types()
    assert buttons == [
        {
            "title": ":new: Erstberatung",
            "payload": '/termin_type_inform{"termin_type": "erstberatung"}',
        },
        {
            "title": "➡️ Folgeberatung",
            "payload": '/termin_type_inform{"termin_type": "folgeberatung"}',
        }
    ]

from unittest.mock import patch

import emoji

from bot_pilot.domain.tax_consultant import TaxConsultant
from bot_pilot.service.provider.button_factory import (
    make_buttons_termin_mediums,
    make_buttons_termin_types,
    make_buttons_tax_consultant,
)


def test_make_buttons_termin_mediums():
    buttons = make_buttons_termin_mediums()
    assert buttons == [
        {
            "title": f"{emoji.emojize(':e-mail:')} E-Mail",
            "payload": '/termin_medium_inform{"termin_medium": "mail"}',
        },
        {
            "title": f"{emoji.emojize(':telephone_receiver:')} Telefon",
            "payload": '/termin_medium_inform{"termin_medium": "phone"}',
        },
        {
            "title": (
                f"{emoji.emojize(':smiling_face_with_smiling_eyes:')} "
                f"Erledige du das"
            ),
            "payload": '/termin_medium_inform{"termin_medium": "bot"}',
        },
    ]


def test_make_buttons_termin_type():
    buttons = make_buttons_termin_types()
    assert buttons == [
        {
            "title": f"{emoji.emojize(':NEW_button:')} Erstberatung",
            "payload": '/termin_type_inform{"termin_type": "erstberatung"}',
        },
        {
            "title": f"{emoji.emojize(':right_arrow:')} Folgeberatung",
            "payload": '/termin_type_inform{"termin_type": "folgeberatung"}',
        },
    ]


@patch("bot_pilot.service.provider.button_factory.get_consultant")
def test_make_buttons_tax_consultant(service_mock):
    consultants = dict()
    consultants["1"] = TaxConsultant("1", "Doe", "John")
    service_mock.return_value = consultants
    result_buttons: list[dict] = make_buttons_tax_consultant("default")

    assert len(result_buttons) == 1
    assert result_buttons[0].get("title") == f'{emoji.emojize(":consultant:")} John Doe'
    assert (
        result_buttons[0].get("payload")
        == '/consultant_inform{"consultant_name":"John Doe"}'
    )

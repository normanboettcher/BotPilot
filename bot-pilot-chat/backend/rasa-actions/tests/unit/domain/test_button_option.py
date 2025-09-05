import emoji

from bot_pilot.domain.button_option import ButtonOption


def test_render():
    button = ButtonOption(
        title="E-Mail",
        payload='/termin_medium_inform{"termin_medium": "mail"}',
        emoji=f'{emoji.emojize(":email:")}',
    )
    rendered = button.render()
    assert rendered == {
        "title": ":email: E-Mail",
        "payload": '/termin_medium_inform{"termin_medium": "mail"}',
    }

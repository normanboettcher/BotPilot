import pytest

from bot_pilot.service.validation.user_info_form_validation_service import (
    validate_input_user_mail,
)
from bot_pilot.service.validation.user_info_form_validation_service import (
    validate_input_user_name,
)


@pytest.mark.parametrize(
    "email",
    [
        "peter@gmx.de",
        "123@web.de",
        "klaus.mueller@web.de",
        "peter1.meyer123@gmx.de",
        "meyer123@web.de",
        "richard.becker88@t-online.de",
    ],
)
def test_validate_user_mail_success(email):
    # given
    valid_email = email

    # when
    result = validate_input_user_mail(valid_email)

    # then
    assert result == True


@pytest.mark.parametrize(
    "email",
    [
        " ",
        None,
        "peter@@gmx.de",
        "123.de",
        "@web.de",
        "hans@de," "test@",
        "peter@.de",
    ],
)
def test_validate_user_mail_failure(email):
    # given
    invalid_email = email

    # when
    result = validate_input_user_mail(invalid_email)

    # then
    assert result == False


@pytest.mark.parametrize(
    "user_name",
    [
        "Peter Meyer",
        "Peter Müller",
        "Lisa-Sophie Becker",
        "Klaus Becker-Müller",
        "Hans van Bayern",
        "peter meyer",
    ],
)
def test_validate_user_name_success(user_name):
    # given
    valid_user_name = user_name.strip().title()

    # when
    result = validate_input_user_name(valid_user_name)

    # then
    assert result == True


@pytest.mark.parametrize(
    "user_name", ["PeterMeyer", "Peter", "Lisa-Sophie-Becker", "Becker-Müller"]
)
def test_validate_user_name_failure(user_name):
    # given
    invalid_user_name = user_name.strip()

    # when
    result = validate_input_user_name(invalid_user_name)

    # then
    assert result == False

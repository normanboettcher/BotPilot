import pytest

from bot_pilot.service.validation.consultant_form_validation_service import (
    validate_input_consultant_name,
)


@pytest.mark.parametrize(
    "consultant_name",
    [
        "Peter Meyer",
        "Peter Müller",
        "Lisa-Sophie Becker",
        "Klaus Becker-Müller",
        "Hans van Bayern",
        "peter meyer",
    ],
)
def test_validate_consultant_name_sucess(consultant_name):
    # given
    valid_consultant_name = consultant_name.strip().title()

    # when
    result = validate_input_consultant_name(valid_consultant_name)

    # then
    assert result == True


@pytest.mark.parametrize(
    "consultant_name",
    ["PeterMeyer", "Peter", "Lisa-Sophie-Becker", "Becker-Müller"],
)
def test_validate_consultant_name_failure(consultant_name):
    # given
    invalid_consultant_name = consultant_name.strip().title()

    # when
    result = validate_input_consultant_name(invalid_consultant_name)

    # then
    assert result == False

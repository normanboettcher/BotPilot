import pytest

from bot_pilot.domain.validators import is_valid_german_name


@pytest.mark.parametrize(
    "name",
    [
        "Peter Meyer",
        "Peter Müller",
        "Lisa-Sophie Becker",
        "Klaus Becker-Müller",
        "Hans van Bayern",
        "peter meyer",
    ],
)
def test_valid_german_names(name: str):
    assert is_valid_german_name(name.strip().title())


@pytest.mark.parametrize(
    "name",
    [
        "PeterMeyer",
        "Peter",
        "Lisa-Sophie-Becker",
        "Becker-Müller",
        None,
    ],
)
def test_invalid_german_names(name: str | None):
    assert not is_valid_german_name(name)

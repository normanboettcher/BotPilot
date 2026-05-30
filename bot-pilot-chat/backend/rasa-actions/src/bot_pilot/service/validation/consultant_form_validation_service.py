from bot_pilot.domain.validators import is_valid_german_name


def validate_input_consultant_name(consultant_name: str | None) -> bool:
    return is_valid_german_name(consultant_name)

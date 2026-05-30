import re

from bot_pilot.domain.validators import is_valid_german_name


def validate_input_user_mail(user_mail: str | None) -> bool:
    if user_mail is None:
        return False
    regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.fullmatch(regex, user_mail.strip()) is not None


def validate_input_user_name(user_name: str | None) -> bool:
    return is_valid_german_name(user_name)

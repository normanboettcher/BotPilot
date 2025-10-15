import re


def validate_input_user_mail(user_mail: str | None) -> bool:
    if user_mail is None:
        return False
    regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    mail = user_mail.strip()
    return re.fullmatch(regex, mail) is not None


def validate_input_user_name(user_name: str | None) -> bool:
    if user_name is None:
        return False
    regex = (
        r"^([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*|[a-zäöüß]+)( ([A-ZÄÖÜ]"
        r"[a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*"
        r"|[a-zäöüß]+))+$"
    )

    user_name = user_name.strip()
    return re.fullmatch(regex, user_name) is not None

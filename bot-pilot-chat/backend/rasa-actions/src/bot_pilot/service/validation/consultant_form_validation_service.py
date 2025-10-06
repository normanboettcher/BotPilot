import re


def validate_input_consultant_name(consultant_name: str | None) -> bool:
    if consultant_name is None:
        return False
    regex = (
        r"^([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*|[a-zäöüß]+)( ([A-ZÄÖÜ]"
        r"[a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*"
        r"|[a-zäöüß]+))+$"
    )

    consultant_name = consultant_name.strip()
    return re.fullmatch(regex, consultant_name) is not None

import re

_GERMAN_NAME_REGEX = (
    r"^([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*|[a-zäöüß]+)"
    r"( ([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)*|[a-zäöüß]+))+$"
)


def is_valid_german_name(name: str | None) -> bool:
    if name is None:
        return False
    return re.fullmatch(_GERMAN_NAME_REGEX, name.strip()) is not None

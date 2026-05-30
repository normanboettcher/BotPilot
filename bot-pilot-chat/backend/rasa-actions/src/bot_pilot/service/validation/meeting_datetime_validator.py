from datetime import datetime


def is_utc_datetime(s: str) -> bool:
    try:
        datetime.strptime(s, "%Y-%m-%dT%H:%M:%S.%fZ")
        return True
    except ValueError:
        return False

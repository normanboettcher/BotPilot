from datetime import datetime


def is_utc_datetime(s):
    try:
        # Z am Ende bedeutet UTC
        datetime.strptime(s, "%Y-%m-%dT%H:%M:%S.%fZ")
        return True
    except ValueError:
        return False

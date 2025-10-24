from datetime import datetime


def is_utc_datetime(s):
    try:
        # Z am Ende bedeutet UTC
        datetime.strptime(s, "%d-%m-%YT%H:%M:%SZ")
        return True
    except ValueError:
        return False

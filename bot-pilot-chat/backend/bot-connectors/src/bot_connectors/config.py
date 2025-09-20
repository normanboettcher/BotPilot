import os.path

from dotenv import dotenv_values


def get_config():
    return dotenv_values(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

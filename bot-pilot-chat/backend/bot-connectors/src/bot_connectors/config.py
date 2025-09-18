import os.path

from dotenv import load_dotenv
def get_config():
    return load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
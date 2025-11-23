import os.path


def get_config():
    return {'DATABASE_URL': os.getenv('DATABASE_URL')}

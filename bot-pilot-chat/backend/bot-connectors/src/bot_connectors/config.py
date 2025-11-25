import os.path


def get_config():
    DATABASE_NAME = os.getenv('CONNECTORS_DB_NAME')
    DATABASE_IP = os.getenv('CONNECTORS_DB_IP')
    DATABASE_PORT = os.getenv('CONNECTORS_DB_PORT')
    DATABASE_SECRET = os.getenv('CONNECTORS_DB_SECRET')
    return {
        'DATABASE_URL': f'mysql+pymysql://{DATABASE_SECRET}@{DATABASE_IP}:{DATABASE_PORT}/{DATABASE_NAME}',
        'LOG_LEVEL': os.getenv('LOG_LEVEL', 'INFO')}

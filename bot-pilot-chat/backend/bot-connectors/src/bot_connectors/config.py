import logging
import os.path

logger = logging.getLogger(__name__)


def get_config():
    DATABASE_NAME = os.getenv('CONNECTORS_DB_NAME')
    DATABASE_IP = os.getenv('CONNECTORS_DB_IP')
    DATABASE_PORT = os.getenv('CONNECTORS_DB_PORT')
    VAULT_ADDR = os.getenv('VAULT_ADDR')
    CONNECTORS_VAULT_APP_ROLE_ID = os.getenv('CONNECTORS_VAULT_APP_ROLE_ID')
    CONNECTORS_VAULT_SECRET_ID = get_secret_id()
    logger.info(f'database ip: [{DATABASE_IP}]')
    return {
        'LOG_LEVEL': os.getenv('LOG_LEVEL', 'info'),
        'CONNECTORS_DB_IP': DATABASE_IP,
        'CONNECTORS_DB_PORT': DATABASE_PORT,
        'CONNECTORS_DB_NAME': DATABASE_NAME,
        'VAULT_ADDR': VAULT_ADDR,
        'CONNECTORS_VAULT_APP_ROLE_ID': CONNECTORS_VAULT_APP_ROLE_ID,
        'CONNECTORS_VAULT_SECRET_ID': CONNECTORS_VAULT_SECRET_ID
    }


def get_secret_id():
    with open('/run/secrets/bot-connectors-secret-id', 'r') as f:
        return f.read().strip()

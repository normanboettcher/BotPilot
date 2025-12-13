from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from typing import Optional, Dict

from bot_connectors.config import get_config
from bot_connectors.service.client.vault_client import VaultClient


class DatabaseConnector:
    def __init__(self, vault_client: VaultClient, db_role: str, config: dict):
        self.vault_client = vault_client
        self.db_role = db_role
        self.engine: Optional[Engine] = None
        self.config = config

    def get_engine(self) -> Engine:
        """Return SQLAlchemy Engine using dynamic credentials."""
        creds = self.vault_client.get_db_creds(self.db_role)
        db_ip = creds['CONNECTORS_DB_IP']
        db_port = creds['CONNECTORS_DB_PORT']
        db_name = creds['CONNECTORS_DB_NAME']
        db_url = (f"mysql+pymysql://{creds['username']}:{creds['password']}"
                  f"@{db_ip}:{db_port}/{db_name}")
        # Create a new engine each time to ensure fresh credentials if rotated
        self.engine = create_engine(db_url, pool_pre_ping=True)
        return self.engine

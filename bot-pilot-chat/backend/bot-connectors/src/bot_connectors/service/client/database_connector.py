import logging

from fastapi.params import Depends
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from typing import Optional

from sqlalchemy.orm import sessionmaker

from bot_connectors.config import get_config
from bot_connectors.service.client.vault_client import VaultClient, get_vault_client

logger = logging.getLogger(__name__)


class DatabaseConnector:
    def __init__(self, vault_client: VaultClient, db_role: str, config: dict):
        self.vault_client = vault_client
        self.db_role = db_role
        self.engine: Optional[Engine] = None
        self.config = config

    def get_engine(self) -> Engine:
        """Return SQLAlchemy Engine using dynamic credentials."""
        creds = self.vault_client.get_db_creds(self.db_role)
        logger.info('get vars from config')
        db_port = self.config['CONNECTORS_DB_PORT']
        db_name = self.config['CONNECTORS_DB_NAME']
        db_ip = self.config['CONNECTORS_DB_IP']
        db_url = (f"mysql+pymysql://{creds['username']}:{creds['password']}"
                  f"@{db_ip}:{db_port}/{db_name}")
        # Create a new engine each time to ensure fresh credentials if rotated
        self.engine = create_engine(db_url, pool_pre_ping=True)
        return self.engine

    def get_db_session(self):
        SessionLocal = sessionmaker(bind=self.get_engine(), autoflush=False,
                                    autocommit=False)
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()


def get_connectors_db_connector(config: dict = Depends(get_config),
                                vault_client: VaultClient = Depends(
                                    get_vault_client)) -> DatabaseConnector:
    return DatabaseConnector(vault_client,
                             "bot-connectors-calendar-role",
                             config)

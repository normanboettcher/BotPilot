import logging

import hvac
from datetime import datetime, timedelta, UTC
from typing import Dict

logger = logging.getLogger(__name__)


class VaultClient:
    def __init__(self, vault_addr: str, role_id: str, secret_id: str):
        self.vault_addr = vault_addr
        self.role_id = role_id
        self.secret_id = secret_id
        self.client = hvac.Client(url=vault_addr)
        self.token_expiry: datetime | None = None
        self._authenticate()

    def _authenticate(self):
        """Authenticate using AppRole and store token with expiry."""
        response = self.client.auth_approle.login(
            role_id=self.role_id,
            secret_id=self.secret_id
        )
        token = response['auth']['client_token']
        lease_duration = response['auth']['lease_duration']
        self.client.token = token
        self.token_expiry = datetime.now(UTC) + timedelta(seconds=lease_duration)
        logger.info(
            f"[VaultClient] Authenticated, token expires in {lease_duration} seconds")

    def _ensure_token(self):
        """Re-authenticate if token is expired or about to expire."""
        if not self.token_expiry or datetime.now(UTC) > self.token_expiry - timedelta(
                seconds=30):
            self._authenticate()

    def get_db_creds(self, db_role: str) -> Dict[str, str]:
        """Fetch dynamic database credentials for a given role."""
        self._ensure_token()
        path = f'database/creds/{db_role}'
        creds = self.client.read(path)
        if not creds or 'data' not in creds:
            raise RuntimeError(f"Failed to fetch DB credentials for role {db_role}")
        return creds['data']

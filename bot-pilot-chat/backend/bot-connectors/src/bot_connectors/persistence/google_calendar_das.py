import logging

from fastapi.params import Depends
from google.oauth2.credentials import Credentials
from sqlalchemy.orm import Session

from google.auth.transport.requests import Request

from bot_connectors.domain.google_calendar_credentials import \
    GoogleCalendarCredentials
from bot_connectors.persistence.db_session_factory import get_db_session

logger = logging.Logger(__name__)


class GoogleCalendarDas:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        pass

    def save_credentials(self, creds: Credentials, customer_context: str):
        # Implement logic to save credentials to the database
        calendar_id = None
        try:
            if not creds.valid and creds.expired and creds.refresh_token:
                logger.info(
                    f'Refreshing access token for {customer_context} '
                    f'before saving')
                creds.refresh(Request())
            entry = self.build_from_credentials(creds,
                                                customer_context)
            calendar_id = entry.calendar_id
            self.db_session.merge(entry)  # upsert
            self.db_session.commit()
            logger.info(
                f'Saved credentials for {calendar_id} successfully')
        except Exception as e:
            self.db_session.rollback()
            logger.error(
                f'Failed to save credentials for: ['
                f'{calendar_id if calendar_id is not None
                else customer_context}-google-calendar]: {e}')
            raise

    def update_credentials_after_refresh(self, creds: Credentials,
                                         entry: type[GoogleCalendarCredentials]
                                                | None):
        try:
            entry.access_token = creds.token
            entry.expiry = creds.expiry
            if creds.refresh_token:
                entry.refresh_token = creds.refresh_token
            self.db_session.commit()
            logger.info(f'Updated credentials for {entry.calendar_id}'
                        f'successfully')
        except Exception as e:
            self.db_session.rollback()
            logger.error(f'Failed to update credentials after refresh for'
                         f'{entry.calendar_id}')
            raise

    def get_credentials_for_context(self,
                                    customer_context: str
                                    ) -> Credentials | None:
        entry = self.db_session.query(GoogleCalendarCredentials).filter_by(
            customer_context=customer_context).first()
        if entry is None:
            return None

        creds = Credentials(
            token=entry.access_token,
            refresh_token=entry.refresh_token,
            token_uri=entry.token_uri,
            client_id=entry.client_id,
            client_secret=entry.client_secret,
            expiry=entry.expiry,
        )

        if not creds.valid and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            try:
                self.update_credentials_after_refresh(creds, entry)
            except Exception as e:
                logger.error(f'Error updating credentials after refresh: {e}')
                raise
        return creds

    def build_from_credentials(self, cred: Credentials, customer_context: str):
        return GoogleCalendarCredentials(
            calendar_id=f'{customer_context}-google-calendar',
            customer_context=customer_context,
            client_id=cred.client_id,
            client_secret=cred.client_secret,
            access_token=cred.token,
            refresh_token=cred.refresh_token,
            token_uri=cred.token_uri,
            expiry=cred.expiry,
        )


def get_google_calendar_das(db: Session=Depends(get_db_session)):
    return GoogleCalendarDas(db_session=db)

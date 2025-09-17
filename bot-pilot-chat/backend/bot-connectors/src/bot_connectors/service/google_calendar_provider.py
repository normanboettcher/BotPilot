import logging

from sqlalchemy.orm import Session
from googleapiclient.discovery import build

from bot_connectors.persistence.google_calendar_das import GoogleCalendarDas

logger = logging.Logger(__name__)


class GoogleCalendarProvider:
    def __init__(self, db_session: Session, customer_context: str):
        self._db_session = db_session
        self._customer_context = customer_context

    def get_google_calendar_service(self):
        das = GoogleCalendarDas(self._db_session)
        try:
            calendar_creds = das.get_credentials_for_context(
                self._customer_context)
            logger.debug(f'Received credentials for google-calendar for '
                         f'[{self._customer_context}] successfully')
            return build("calendar", "v3",
                         credentials=calendar_creds)
        except Exception as e:
            logger.error(f'Failed to get credentials for '
                         f'google-calendar for [{self._customer_context}]: {e}')
            raise

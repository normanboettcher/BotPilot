from sqlalchemy.orm import Session
from googleapiclient.discovery import build

from bot_connectors.persistence.google_calendar_das import GoogleCalendarDAS


class GoogleCalendarProvider:
    def __init__(self, db_session: Session, customer_context: str):
        self._db_session = db_session
        self._customer_context = customer_context

    def get_google_calendar_service(self):
        das = GoogleCalendarDAS(self._db_session)
        calendar_creds = das.get_credentials_for_context(self._customer_context)
        return build("calendar", "v3",
                     credentials=calendar_creds)

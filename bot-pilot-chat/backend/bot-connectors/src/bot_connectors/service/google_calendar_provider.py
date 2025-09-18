import logging

from fastapi.params import Depends
from googleapiclient.discovery import build, Resource

from bot_connectors.persistence.google_calendar_das import (
    GoogleCalendarDas,
    get_google_calendar_das,
)

logger = logging.Logger(__name__)


class GoogleCalendarProvider:
    def __init__(self, das: GoogleCalendarDas):
        self._das = das

    def get_google_calendar_as_service(self, customer_context: str) -> Resource:
        try:
            calendar_creds = self._das.get_credentials_for_context(
                customer_context
            )
            logger.debug(
                f"Received credentials for google-calendar for "
                f"[{customer_context}] successfully"
            )
            return build("calendar", "v3", credentials=calendar_creds)
        except Exception as e:
            logger.error(
                f"Failed to get credentials for "
                f"google-calendar for [{customer_context}]: {e}"
            )
            raise


def get_google_calendar_provider(
    das: GoogleCalendarDas = Depends(get_google_calendar_das),
):
    return GoogleCalendarProvider(das)

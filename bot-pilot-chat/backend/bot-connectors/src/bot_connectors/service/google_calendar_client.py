import logging

from fastapi.params import Depends
from googleapiclient.discovery import build, Resource

from bot_connectors.persistence.google_calendar_credentials_das import (
    GoogleCalendarCredentialsDas,
    get_google_calendar_credentials_das,
)

logger = logging.Logger(__name__)


class GoogleCalendarClient:
    def __init__(self, das: GoogleCalendarCredentialsDas):
        self._das = das

    def get_google_calendar_as_service(
        self, customer_context: str
    ) -> Resource | None:
        try:
            calendar_creds = self._das.get_credentials_for_context(
                customer_context
            )
            if calendar_creds is None or not calendar_creds:
                logger.debug(f"no creds found in user_tokens: {calendar_creds}")
                return None
            logger.debug(
                f"Received credentials for google-calendar for "
                f"[{customer_context}] successfully"
            )
            logger.debug(
                f"received creds: refresh_token: [{calendar_creds.refresh_token}]"
                f"token: [{calendar_creds.token}]"
            )
            return build("calendar", "v3", credentials=calendar_creds)
        except Exception as e:
            logger.error(
                f"Failed to get credentials for "
                f"google-calendar for [{customer_context}]: {e}"
            )
            raise


def get_google_calendar_client(
    das: GoogleCalendarCredentialsDas = Depends(
        get_google_calendar_credentials_das
    ),
):
    return GoogleCalendarClient(das)

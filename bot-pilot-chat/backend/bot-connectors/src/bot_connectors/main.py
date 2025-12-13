import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.params import Depends
from fastapi.responses import RedirectResponse, JSONResponse
from google_auth_oauthlib.flow import Flow
import os

from sqlalchemy import Engine, text
from starlette.middleware.cors import CORSMiddleware

from bot_connectors.domain.calendar.events.busy_events_response import (
    BusyEventsResponse,
)
from bot_connectors.domain.calendar.events.create_event_request import (
    CreateGoogleCalendarEventRequest,
)
from bot_connectors.domain.persistence_model_base import Base
from bot_connectors.persistence.google_calendar_credentials_das import (
    GoogleCalendarCredentialsDas,
    get_google_calendar_credentials_das,
)
from bot_connectors.service.calendar.api.calendar_event_reader import (
    CalendarEventsReader,
)
from bot_connectors.service.calendar.api.calendar_event_writer import (
    CalendarEventWriter,
)
from bot_connectors.service.calendar.google.google_calendar_events_provider import (
    get_google_calendar_events_provider,
)
from bot_connectors.service.calendar.google.google_calendar_events_writer import (
    get_google_calendar_events_writer,
)
from bot_connectors.service.client.database_connector import DatabaseConnector, \
    get_connectors_db_connector


# def create_tables_at_startup():
#    Base.metadata.create_all(bind=get_db_engine())


@asynccontextmanager
async def lifespan(app: FastAPI):
    # create_tables_at_startup()
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# set redirect url. should be the same as in Google Cloud Console
REDIRECT_URI = "http://localhost:8000/oauth2/callback"

# Scopes: read and write access to Google Calendar
SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.freebusy",
]

# path to downloaded OAuth 2.0 Client IDs json file
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), "config.json")

logger = logging.getLogger(__name__)
logger.debug("Starting prototype bot-connector for Google Calendar OAuth2")

# in a real project, save tokens in (DB/Redis/etc.)
user_tokens = {}


@app.get("/oauth2/start")
def auth_start():
    """starts OAuth flow with Google"""
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI
    )
    auth_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    user_tokens["state"] = state
    logger.debug(f"user_tokens: {user_tokens}")
    return RedirectResponse(auth_url)


@app.get("/test-db-connection")
def test_db(connector: DatabaseConnector = Depends(get_connectors_db_connector)):
    try:
        engine = connector.get_engine()
        logger.debug(f"engine: {engine}")
        with engine.connect() as conn:
            result = conn.execute(text('SELECT NOW()')).fetchone()
        return {"status": "ok", "db_time": str(result[0])}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/oauth2/callback")
def auth_callback(
        request: Request,
        das: GoogleCalendarCredentialsDas = Depends(
            get_google_calendar_credentials_das),
):
    """Callback after successful OAuth with Google"""
    state = request.query_params.get("state")
    logger.debug(f"requested state: {state}")
    if state != user_tokens.get("state"):
        return JSONResponse({"error": "Invalid state"}, status_code=400)

    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    logger.debug(f"request: {request}")
    logger.debug(f"call back flow: {str(request.url)}")
    # only for testing, allows http (not https)
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    flow.fetch_token(authorization_response=str(request.url))
    creds = flow.credentials

    logger.debug(f"creds: {creds}")
    # Hier einfach in Memory speichern (für MVP).
    # Später: in DB speichern (verschlüsselt!)
    user_tokens["creds"] = creds
    # save for the first time.
    das.save_credentials(creds, "default")

    return JSONResponse({"status": "ok", "message": "OAuth erfolgreich"})


@app.get("/calendar/google/events/busy")
def list_events(
        request: Request,
        busy_events_provider: CalendarEventsReader = Depends(
            get_google_calendar_events_provider
        ),
):
    next_days = request.query_params.get("next_days", None)
    try:
        if next_days is not None:
            busy_events = busy_events_provider.read_busy_events_next(
                "default", next_days=int(next_days)
            )
        else:
            busy_events = busy_events_provider.read_busy_events_next("default")
    except Exception as e:
        return JSONResponse(
            {
                "status": "failed",
                "message": (
                    f"Beim Abruf der naechsten [{next_days}] Tage ist ein "
                    f"unerwarteter Fehler aufgetreten: {e}"
                ),
                "status_code": "500",
            }
        )
    if busy_events is None:
        return JSONResponse(
            {
                "status": "failed",
                "message": "Not authenticated.",
                "status_code": "401",
            }
        )
    return JSONResponse(
        BusyEventsResponse(
            int(next_days) if next_days is not None else 90, busy_events
        ).to_dict()
    )


@app.post("/calendar/google/events/create")
def create_event_google_calendar(
        request: CreateGoogleCalendarEventRequest,
        events_writer: CalendarEventWriter = Depends(get_google_calendar_events_writer),
):
    logger.debug(f"request: {request.to_dict()}")
    try:
        event_created = events_writer.create_event(
            request.event, request.customer_context
        )
        if not event_created.is_success():
            return JSONResponse(
                {
                    "status": "failure",
                    "message": event_created.error_message,
                    "status_code": "500",
                    "success": False,
                }
            )
        return JSONResponse(
            {
                "status": "ok",
                "message": "event successfully created",
                "status_code": "200",
                "success": True,
            }
        )
    except Exception as e:
        logger.error(
            f"An error occurred trying to create event: [{request.event.as_dict()}]. "
            f"Error: [{e}]"
        )
        return JSONResponse(
            {"status": "failure", "message": e, "status_code": "500", "success": False}
        )

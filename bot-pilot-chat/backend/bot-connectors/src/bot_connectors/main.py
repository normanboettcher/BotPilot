import logging

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os

app = FastAPI()

# set redirect url. should be the same as in Google Cloud Console
REDIRECT_URI = "http://localhost:8000/oauth2/callback"

# Scopes: read and write access to Google Calendar
SCOPES = ["https://www.googleapis.com/auth/calendar"]

# path to downloaded OAuth 2.0 Client IDs json file
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), "config.json")

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

logger.debug("Starting prototype bot-connector for Google Calendar OAuth2")

# in a real project, save tokens in (DB/Redis/etc.)
user_tokens = {}


@app.get("/oauth2/start")
def auth_start():
    """starts OAuth flow with Google"""
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    auth_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    user_tokens["state"] = state
    logger.debug(f"user_tokens: {user_tokens}")
    return RedirectResponse(auth_url)


@app.get("/oauth2/callback")
def auth_callback(request: Request):
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

    return JSONResponse({"status": "ok", "message": "OAuth erfolgreich"})


@app.get("/calendar/events")
def list_events():
    """Example: list next 5 events from primary calendar"""

    creds = user_tokens.get("creds")
    if not creds:
        logger.debug(f'no creds found in user_tokens: {creds}')
        return JSONResponse({"error": "Not authenticated"}, status_code=401)

    service = build("calendar", "v3", credentials=creds)
    events_result = (
        service.events()
        .list(
            calendarId="primary",
            maxResults=5,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])
    return events

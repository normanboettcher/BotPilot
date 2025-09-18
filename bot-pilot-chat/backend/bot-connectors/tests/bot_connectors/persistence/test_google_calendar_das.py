import pytest
from google.oauth2.credentials import Credentials
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker

from bot_connectors.domain.google_calendar_credentials import Base
from bot_connectors.persistence.google_calendar_das import GoogleCalendarDas

TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture
def test_db():
    TestingSessionLocal = sessionmaker(
        bind=engine, autoflush=False, autocommit=False
    )
    # create tables for testing
    Base.metadata.create_all(bind=engine)

    yield TestingSessionLocal

    Base.metadata.drop_all(bind=engine)
    engine.dispose()


def test_save_and_get_credentials(test_db):
    # given
    db = test_db()
    das = GoogleCalendarDas(db)

    creds = Credentials(
        client_id="id",
        client_secret="test_secret",
        token="access",
        refresh_token="refresh",
        token_uri="https://oauth2.googleapis.com/token",
    )

    customer_context = "musterkanzlei"

    # when
    das.save_credentials(creds, customer_context)
    retrieved_creds = das.get_credentials_for_context(customer_context)

    # then
    assert retrieved_creds.token == "access"
    assert retrieved_creds.refresh_token == "refresh"
    assert retrieved_creds.client_id == "id"
    assert retrieved_creds.client_secret == "test_secret"

    db.close()

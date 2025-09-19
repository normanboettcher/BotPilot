from sqlalchemy import Column, String, DateTime

from bot_connectors.domain.persistence_model_base import Base


class GoogleCalendarCredentials(Base):
    __tablename__ = "google_credentials"

    calendar_id = Column(
        String(500),
        nullable=False,
        primary_key=True,
    )
    customer_context = Column(String(500), nullable=False)
    client_id = Column(String(500), nullable=False)
    client_secret = Column(String(500), nullable=False)
    access_token = Column(String(2500), nullable=False)
    refresh_token = Column(String(2500), nullable=False)
    token_uri = Column(
        String(1000),
        nullable=False,
        default="https://oauth2.googleapis.com/token",
    )
    expiry = Column(DateTime, nullable=True)
    scopes=Column(String(1000), nullable=True)

    def __repr__(self):
        return (
            f"<GoogleCredentials(client_id={self.client_id}, "
            f"project_id={self.project_id})>"
        )

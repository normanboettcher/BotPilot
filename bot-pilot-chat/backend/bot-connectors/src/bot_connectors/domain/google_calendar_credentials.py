from sqlalchemy import Column, String, DateTime

from bot_connectors.domain.persistence_model_base import Base


class GoogleCalendarCredentials(Base):
    __tablename__ = "google_credentials"

    calendar_id = Column(String, nullable=False, primary_key=True)
    customer_context = Column(String, nullable=False)
    client_id = Column(String, nullable=False)
    client_secret = Column(String, nullable=False)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    token_uri = Column(
        String, nullable=False, default="https://oauth2.googleapis.com/token"
    )
    expiry = Column(DateTime, nullable=True)

    def __repr__(self):
        return (
            f"<GoogleCredentials(client_id={self.client_id}, "
            f"project_id={self.project_id})>"
        )

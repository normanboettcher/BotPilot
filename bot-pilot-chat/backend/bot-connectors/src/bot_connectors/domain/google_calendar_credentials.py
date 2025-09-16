from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class GoogleCalendarCredentials(Base):
    __tablename__ = 'google_credentials'

    customer_context = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, nullable=False)
    client_secret = Column(String, nullable=False)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    token_uri = Column(String, nullable=False,
                       default="https://oauth2.googleapis.com/token")
    expiry = Column(DateTime, nullable=True)

    def __repr__(self):
        return (f"<GoogleCredentials(client_id={self.client_id}, "
                f"project_id={self.project_id})>")

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class AppConfig:
    faq_service_url: str

    @classmethod
    def from_env(cls) -> "AppConfig":
        return cls(
            faq_service_url=os.getenv(
                "FAQ_SERVICE_URL", "http://localhost:8000/api/faqs"
            ),
        )

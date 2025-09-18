from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from bot_connectors.config import get_config
from bot_connectors.domain.persistence_model_base import Base


def get_db_engine():
    config = get_config()
    DATABASE_URL = config["DATABASE_URL"]
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    Base.metadata.create_all(bind=engine)
    return engine


def get_db_session():
    SessionLocal = sessionmaker(
        bind=get_db_engine(), autoflush=False, autocommit=False
    )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

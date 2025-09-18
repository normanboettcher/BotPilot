from contextlib import contextmanager

from docs.conf import autoclass_content
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from bot_connectors.config import get_config


def get_db_engine():
    config = get_config()
    DATABASE_URL = config['DATABASE_URL']
    return create_engine(DATABASE_URL, pool_pre_ping=True)


_engine = get_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)


@contextmanager
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

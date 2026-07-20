import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "CRITICAL ERROR: DATABASE_URL environment parameter variable missing! "
        "Please check that your backend/.env configuration file contains your password."
    )

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    """Builds structural table layers automatically inside PostgreSQL on startup."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency link loop manager to handle network connection cleanup operations securely."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

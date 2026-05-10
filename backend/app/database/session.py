from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# connect_args={"check_same_thread": False} is required only for SQLite in FastAPI
# so that multiple requests can share the same database connection.
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} 
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is a dependency we will use in our FastAPI routes to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
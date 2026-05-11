from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.
    Every model will inherit from this so Alembic can find them.
    """
    pass
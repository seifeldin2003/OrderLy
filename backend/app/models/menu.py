from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class MenuItem(Base):
    __tablename__ = "menu"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)

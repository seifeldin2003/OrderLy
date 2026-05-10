from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

# Base schema with shared properties
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

# Schema for incoming registration request
class UserCreate(UserBase):
    password: str

# Schema for outgoing user data (hides the password!)
class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    
    # This tells Pydantic to read data directly from the SQLAlchemy model
    model_config = ConfigDict(from_attributes=True)
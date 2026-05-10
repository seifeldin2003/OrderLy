from pydantic import BaseModel
from app.schemas.user import UserResponse

# Schema for the login request
class LoginRequest(BaseModel):
    email: str
    password: str

# Schema for the response sent back after successful login or registration
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
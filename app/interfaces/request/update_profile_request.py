from pydantic import BaseModel, EmailStr

class UpdateProfileRequest(BaseModel):
    fullName: str
    email: EmailStr

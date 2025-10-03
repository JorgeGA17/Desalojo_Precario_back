from pydantic import BaseModel

class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str

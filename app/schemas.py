from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

# Room schemas
class RoomBase(BaseModel):
    name: str
    capacity: int
    location: str
    amenities: str

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    room_id: int
    start_time: datetime
    end_time: datetime
    purpose: str

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 
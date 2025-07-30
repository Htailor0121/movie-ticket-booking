from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Movie schemas
class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    genre: str
    duration: int
    release_date: datetime
    image_url: str
    price: float

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        from_attributes = True

# Theater schemas
class TheaterBase(BaseModel):
    name: str
    location: str
    total_seats: int

class TheaterCreate(TheaterBase):
    pass

class Theater(TheaterBase):
    id: int

    class Config:
        from_attributes = True

# Show schemas
class ShowBase(BaseModel):
    movie_id: int
    theater_id: int
    show_time: datetime
    available_seats: int
    price: float

class ShowCreate(ShowBase):
    pass

class Show(ShowBase):
    id: int
    movie: Movie
    theater: Theater
    locked_seats: Optional[List[str]] = None
    locked_seats_expiry: Optional[datetime] = None

    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    show_id: int
    num_seats: int
    total_amount: float
    seat_numbers: List[str]

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    booking_time: datetime
    payment_status: str
    payment_id: Optional[str] = None
    show: Show

    class Config:
        from_attributes = True

# Seat locking schemas
class SeatLockRequest(BaseModel):
    seat_numbers: List[str]

class SeatLockResponse(BaseModel):
    show_id: int
    locked_seats: List[str]
    expiry_time: datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
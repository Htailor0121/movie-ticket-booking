from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    city = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    bookings = relationship("Booking", back_populates="user")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    genre = Column(String(100))
    duration = Column(Integer)  # Duration in minutes
    release_date = Column(DateTime)
    poster_url = Column(String(255))  # Changed from image_url to poster_url
    price = Column(Float, nullable=False)
    shows = relationship("Show", back_populates="movie")

class Theater(Base):
    __tablename__ = "theaters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    total_seats = Column(Integer)
    shows = relationship("Show", back_populates="theater")

class Show(Base):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    theater_id = Column(Integer, ForeignKey("theaters.id"))
    show_time = Column(DateTime, nullable=False)
    available_seats = Column(Integer)
    price = Column(Float, nullable=False)
    locked_seats = Column(JSON, default=[])  # List of temporarily locked seats
    locked_seats_expiry = Column(DateTime)  # Expiry time for locked seats
    
    movie = relationship("Movie", back_populates="shows")
    theater = relationship("Theater", back_populates="shows")
    bookings = relationship("Booking", back_populates="show")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    show_id = Column(Integer, ForeignKey("shows.id"))
    num_seats = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    booking_time = Column(DateTime, nullable=False)
    payment_status = Column(String(50), default="pending")
    payment_id = Column(String(255))
    seat_numbers = Column(JSON, nullable=False)  # List of booked seat numbers
    
    user = relationship("User", back_populates="bookings")
    show = relationship("Show", back_populates="bookings")
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Booking, Show, User
from schemas import BookingCreate, Booking as BookingSchema
from auth import get_current_active_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("/", response_model=List[BookingSchema])
def get_bookings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).offset(skip).limit(limit).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingSchema)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.post("/", response_model=BookingSchema)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if show exists and is in the future
    show = db.query(Show).filter(Show.id == booking.show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    if show.show_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Cannot book for past shows")
    
    # Check if enough seats are available
    if show.available_seats < booking.num_seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")
    
    # Create booking
    db_booking = Booking(
        **booking.dict(),
        user_id=current_user.id,
        booking_time=datetime.utcnow(),
        payment_status="pending"
    )
    
    # Update available seats
    show.available_seats -= booking.num_seats
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.put("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if show is in the future
    if booking.show.show_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Cannot cancel booking for past shows")
    
    # Update available seats
    booking.show.available_seats += booking.num_seats
    
    # Delete booking
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled successfully"}

@router.put("/{booking_id}/payment")
def update_payment_status(
    booking_id: int,
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.payment_status = "completed"
    booking.payment_id = payment_id
    
    db.commit()
    return {"message": "Payment status updated successfully"} 
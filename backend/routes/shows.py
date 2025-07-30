from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import get_db
from models import Show, Movie, Theater
from schemas import ShowCreate, Show as ShowSchema, SeatLockRequest, SeatLockResponse
from auth import get_current_active_user
from models import User

router = APIRouter(prefix="/shows", tags=["Shows"])

@router.get("/", response_model=List[ShowSchema])
def get_shows(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    shows = db.query(Show).offset(skip).limit(limit).all()
    return shows

@router.get("/{show_id}", response_model=ShowSchema)
def get_show(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@router.get("/movie/{movie_id}", response_model=List[ShowSchema])
def get_shows_by_movie(movie_id: int, db: Session = Depends(get_db)):
    shows = db.query(Show).filter(Show.movie_id == movie_id).all()
    return shows

@router.get("/theater/{theater_id}", response_model=List[ShowSchema])
def get_shows_by_theater(theater_id: int, db: Session = Depends(get_db)):
    shows = db.query(Show).filter(Show.theater_id == theater_id).all()
    return shows

@router.post("/", response_model=ShowSchema)
def create_show(
    show: ShowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if movie exists
    movie = db.query(Movie).filter(Movie.id == show.movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Check if theater exists
    theater = db.query(Theater).filter(Theater.id == show.theater_id).first()
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found")
    
    # Check if show time is in the future
    if show.show_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Show time must be in the future")
    
    # Check for overlapping shows in the same theater
    overlapping_show = db.query(Show).filter(
        Show.theater_id == show.theater_id,
        Show.show_time <= show.show_time,
        Show.show_time >= show.show_time
    ).first()
    
    if overlapping_show:
        raise HTTPException(status_code=400, detail="Show time overlaps with existing show")
    
    db_show = Show(**show.dict())
    db.add(db_show)
    db.commit()
    db.refresh(db_show)
    return db_show

@router.put("/{show_id}", response_model=ShowSchema)
def update_show(
    show_id: int,
    show: ShowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_show = db.query(Show).filter(Show.id == show_id).first()
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Check if show time is in the future
    if show.show_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Show time must be in the future")
    
    # Check for overlapping shows in the same theater
    overlapping_show = db.query(Show).filter(
        Show.theater_id == show.theater_id,
        Show.id != show_id,
        Show.show_time <= show.show_time,
        Show.show_time >= show.show_time
    ).first()
    
    if overlapping_show:
        raise HTTPException(status_code=400, detail="Show time overlaps with existing show")
    
    for key, value in show.dict().items():
        setattr(db_show, key, value)
    
    db.commit()
    db.refresh(db_show)
    return db_show

@router.delete("/{show_id}")
def delete_show(
    show_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_show = db.query(Show).filter(Show.id == show_id).first()
    if db_show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    
    db.delete(db_show)
    db.commit()
    return {"message": "Show deleted successfully"}

@router.post("/{show_id}/lock-seats", response_model=SeatLockResponse)
def lock_seats(
    show_id: int,
    request: SeatLockRequest,
    db: Session = Depends(get_db)
):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Check if seats are already locked or booked
    current_time = datetime.utcnow()
    if show.locked_seats_expiry and show.locked_seats_expiry > current_time:
        locked_seats = set(show.locked_seats)
        requested_seats = set(request.seat_numbers)
        if locked_seats.intersection(requested_seats):
            raise HTTPException(
                status_code=400,
                detail="Some seats are already locked by another user"
            )
    
    # Check if seats are already booked
    booked_seats = set()
    for booking in show.bookings:
        if booking.payment_status == "completed":
            booked_seats.update(booking.seat_numbers)
    
    if booked_seats.intersection(request.seat_numbers):
        raise HTTPException(
            status_code=400,
            detail="Some seats are already booked"
        )
    
    # Lock the seats
    show.locked_seats = request.seat_numbers
    show.locked_seats_expiry = current_time + timedelta(minutes=10)  # Lock for 10 minutes
    
    db.commit()
    db.refresh(show)
    
    return SeatLockResponse(
        show_id=show.id,
        locked_seats=request.seat_numbers,
        expiry_time=show.locked_seats_expiry
    )

@router.post("/{show_id}/unlock-seats")
def unlock_seats(
    show_id: int,
    request: SeatLockRequest,
    db: Session = Depends(get_db)
):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Remove the specified seats from locked seats
    if show.locked_seats:
        show.locked_seats = [seat for seat in show.locked_seats if seat not in request.seat_numbers]
        if not show.locked_seats:
            show.locked_seats_expiry = None
    
    db.commit()
    return {"message": "Seats unlocked successfully"} 
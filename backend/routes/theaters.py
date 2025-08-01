from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Theater
from schemas import TheaterCreate, Theater as TheaterSchema
from auth import get_admin_user
from models import User

router = APIRouter(prefix="/theaters", tags=["Theaters"])

@router.get("/", response_model=List[TheaterSchema])
def get_theaters(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    theaters = db.query(Theater).offset(skip).limit(limit).all()
    return theaters

@router.get("/{theater_id}", response_model=TheaterSchema)
def get_theater(theater_id: int, db: Session = Depends(get_db)):
    theater = db.query(Theater).filter(Theater.id == theater_id).first()
    if theater is None:
        raise HTTPException(status_code=404, detail="Theater not found")
    return theater

@router.post("/", response_model=TheaterSchema)
def create_theater(
    theater: TheaterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    db_theater = Theater(**theater.dict())
    db.add(db_theater)
    db.commit()
    db.refresh(db_theater)
    return db_theater

@router.put("/{theater_id}", response_model=TheaterSchema)
def update_theater(
    theater_id: int,
    theater: TheaterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    db_theater = db.query(Theater).filter(Theater.id == theater_id).first()
    if db_theater is None:
        raise HTTPException(status_code=404, detail="Theater not found")
    
    for key, value in theater.dict().items():
        setattr(db_theater, key, value)
    
    db.commit()
    db.refresh(db_theater)
    return db_theater

@router.delete("/{theater_id}")
def delete_theater(
    theater_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    db_theater = db.query(Theater).filter(Theater.id == theater_id).first()
    if db_theater is None:
        raise HTTPException(status_code=404, detail="Theater not found")
    
    db.delete(db_theater)
    db.commit()
    return {"message": "Theater deleted successfully"} 
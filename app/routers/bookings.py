from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from sqlalchemy import func

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=schemas.Booking)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    current_time = datetime.utcnow()
    existing_user_booking = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.user_id == current_user.id,
        models.Booking.end_time > current_time
    ).first()

    if existing_user_booking:
        raise HTTPException(
            status_code=400,
            detail="You already have an active booking for this room"
        )

    overlapping_bookings = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.start_time < booking.end_time,
        models.Booking.end_time > booking.start_time
    ).count()

    if overlapping_bookings >= room.capacity:
        raise HTTPException(
            status_code=400,
            detail=f"Room is at capacity ({room.capacity} bookings). Cannot create more bookings for this time period."
        )

    db_booking = models.Booking(
        **booking.dict(),
        user_id=current_user.id
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/", response_model=List[schemas.Booking])
def read_bookings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.is_admin:
        bookings = db.query(models.Booking).offset(skip).limit(limit).all()
    else:
        bookings = db.query(models.Booking).filter(
            models.Booking.user_id == current_user.id
        ).offset(skip).limit(limit).all()
    return bookings

@router.get("/{booking_id}", response_model=schemas.Booking)
def read_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return booking

@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"} 
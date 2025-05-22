from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
from app.database import engine as postgres_engine
import sqlite3

# Create SQLite engine
sqlite_engine = create_engine('sqlite:///./meeting_room.db')

# Create tables in PostgreSQL
Base.metadata.create_all(bind=postgres_engine)

# Connect to SQLite database
sqlite_conn = sqlite3.connect('meeting_room.db')
sqlite_cursor = sqlite_conn.cursor()

# Create PostgreSQL session
SessionLocal = sessionmaker(bind=postgres_engine)
db = SessionLocal()

try:
    # Migrate users
    sqlite_cursor.execute('SELECT * FROM users')
    users = sqlite_cursor.fetchall()
    for user in users:
        db.execute(
            'INSERT INTO users (id, email, name, is_active, is_admin) VALUES (%s, %s, %s, %s, %s)',
            user
        )

    # Migrate rooms
    sqlite_cursor.execute('SELECT * FROM rooms')
    rooms = sqlite_cursor.fetchall()
    for room in rooms:
        db.execute(
            'INSERT INTO rooms (id, name, capacity, location, amenities, is_active) VALUES (%s, %s, %s, %s, %s, %s)',
            room
        )

    # Migrate bookings
    sqlite_cursor.execute('SELECT * FROM bookings')
    bookings = sqlite_cursor.fetchall()
    for booking in bookings:
        db.execute(
            'INSERT INTO bookings (id, room_id, user_id, start_time, end_time, purpose, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
            booking
        )

    # Commit the changes
    db.commit()
    print("Data migration completed successfully!")

except Exception as e:
    print(f"Error during migration: {e}")
    db.rollback()

finally:
    # Close connections
    sqlite_conn.close()
    db.close() 
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if admin:
            print("Admin user already exists")
            return

        # Create admin user
        admin_user = User(
            email="admin@example.com",
            name="Admin User",
            hashed_password=get_password_hash("admin123"),  # Change this password!
            is_active=True,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user() 
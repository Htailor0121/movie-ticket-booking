#!/usr/bin/env python3
"""
Simple database setup script
This script will:
1. Test database connection
2. Create tables if they don't exist
3. Add sample data if tables are empty
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import only what we need for database operations
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
elif DATABASE_URL and DATABASE_URL.startswith('mysql://'):
    DATABASE_URL = DATABASE_URL.replace('mysql://', 'mysql+pymysql://', 1)
elif DATABASE_URL and DATABASE_URL.startswith('mysql+pymysql://'):
    pass
else:
    password = quote_plus(os.getenv('MYSQL_PASSWORD', ''))
    DATABASE_URL = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{password}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def test_database_connection():
    """Test if we can connect to the database"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def create_tables():
    """Create all tables"""
    try:
        # Import models here to avoid circular imports
        from models import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

def check_tables_exist():
    """Check if tables exist and have data"""
    try:
        db = SessionLocal()
        
        # Import models here
        from models import User, Movie, Theater, Show
        
        user_count = db.query(User).count()
        movie_count = db.query(Movie).count()
        theater_count = db.query(Theater).count()
        show_count = db.query(Show).count()
        
        print(f"📊 Current data:")
        print(f"   Users: {user_count}")
        print(f"   Movies: {movie_count}")
        print(f"   Theaters: {theater_count}")
        print(f"   Shows: {show_count}")
        
        db.close()
        return user_count, movie_count, theater_count, show_count
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return 0, 0, 0, 0

def create_sample_data():
    """Create sample data if tables are empty"""
    try:
        db = SessionLocal()
        
        # Import models and auth here
        from models import User, Movie, Theater, Show
        from auth import get_password_hash
        
        # Check if we already have data
        if db.query(User).count() > 0:
            print("ℹ️  Sample data already exists, skipping...")
            db.close()
            return
        
        print("📝 Creating sample data...")
        
        # Create sample user
        hashed_password = get_password_hash("password123")
        sample_user = User(
            name="John Doe",
            email="john@example.com",
            password=hashed_password,
            phone="+1234567890",
            city="New York",
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(sample_user)
        
        # Create sample movies
        movies = [
            Movie(
                title="The Avengers",
                description="Earth's mightiest heroes assemble",
                genre="Action",
                duration=143,
                release_date=datetime(2012, 5, 4),
                poster_url="https://example.com/avengers.jpg",
                price=12.99
            ),
            Movie(
                title="Inception",
                description="A thief who steals corporate secrets",
                genre="Sci-Fi",
                duration=148,
                release_date=datetime(2010, 7, 16),
                poster_url="https://example.com/inception.jpg",
                price=11.99
            ),
            Movie(
                title="The Dark Knight",
                description="Batman faces his greatest challenge",
                genre="Action",
                duration=152,
                release_date=datetime(2008, 7, 18),
                poster_url="https://example.com/dark-knight.jpg",
                price=13.99
            )
        ]
        
        for movie in movies:
            db.add(movie)
        
        # Create sample theaters
        theaters = [
            Theater(
                name="Cineplex Downtown",
                location="123 Main St, Downtown",
                total_seats=200
            ),
            Theater(
                name="Multiplex Mall",
                location="456 Shopping Ave, Mall",
                total_seats=150
            ),
            Theater(
                name="Art House Cinema",
                location="789 Culture Blvd, Arts District",
                total_seats=80
            )
        ]
        
        for theater in theaters:
            db.add(theater)
        
        db.commit()
        
        # Get the created movies and theaters for shows
        movies = db.query(Movie).all()
        theaters = db.query(Theater).all()
        
        # Create sample shows
        show_times = [
            datetime.utcnow() + timedelta(days=1, hours=14),  # Tomorrow 2 PM
            datetime.utcnow() + timedelta(days=1, hours=17),  # Tomorrow 5 PM
            datetime.utcnow() + timedelta(days=1, hours=20),  # Tomorrow 8 PM
            datetime.utcnow() + timedelta(days=2, hours=15),  # Day after tomorrow 3 PM
            datetime.utcnow() + timedelta(days=2, hours=18),  # Day after tomorrow 6 PM
        ]
        
        shows = []
        for i, movie in enumerate(movies):
            for j, theater in enumerate(theaters):
                if i + j < len(show_times):
                    show = Show(
                        movie_id=movie.id,
                        theater_id=theater.id,
                        show_time=show_times[(i + j) % len(show_times)],
                        available_seats=theater.total_seats,
                        price=movie.price + (j * 2),  # Different prices for different theaters
                        locked_seats=[],
                        locked_seats_expiry=None
                    )
                    shows.append(show)
        
        for show in shows:
            db.add(show)
        
        db.commit()
        db.close()
        
        print("✅ Sample data created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
        db.close()

def main():
    """Main function to run the setup"""
    print("🔍 Checking database setup...")
    print("=" * 50)
    
    # Test database connection
    if not test_database_connection():
        print("\n❌ Cannot proceed without database connection!")
        print("Please check your DATABASE_URL environment variable.")
        return
    
    print("\n📋 Creating tables...")
    if not create_tables():
        print("\n❌ Cannot proceed without tables!")
        return
    
    print("\n🔍 Checking existing data...")
    user_count, movie_count, theater_count, show_count = check_tables_exist()
    
    # Create sample data if no data exists
    if user_count == 0 and movie_count == 0:
        print("\n📝 No data found, creating sample data...")
        create_sample_data()
        print("\n🔍 Checking data after creation...")
        check_tables_exist()
    
    print("\n✅ Database setup complete!")
    print("\n🎬 You can now:")
    print("   1. Start your backend server")
    print("   2. Test the API endpoints")
    print("   3. Use the sample data for testing")

if __name__ == "__main__":
    main() 
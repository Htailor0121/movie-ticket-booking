from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# Check if we're using PostgreSQL (Render) or MySQL
DATABASE_URL = os.getenv('mysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@mysql.railway.internal:3306/railway')

if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    # Convert postgres:// to postgresql:// for SQLAlchemy
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
elif DATABASE_URL and DATABASE_URL.startswith('mysql://'):
    # MySQL connection string from DATABASE_URL
    DATABASE_URL = DATABASE_URL.replace('mysql://', 'mysql+pymysql://', 1)
elif DATABASE_URL and DATABASE_URL.startswith('mysql+pymysql://'):
    # Already in correct format for pymysql
    pass
else:
    # MySQL connection string with individual environment variables
    password = quote_plus(os.getenv('bROiSjvYcsejjOLgChUdodjlInzlxqLx', ''))
    DATABASE_URL = f"mysql+pymysql://{os.getenv('root')}:{password}@{os.getenv('mysql.railway.internal')}/{os.getenv('railway')}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

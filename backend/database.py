from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 🚫 WARNING: Do not hardcode credentials in production

DATABASE_URL = "mysql+pymysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@yamabiko.proxy.rlwy.net:27982/railway"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

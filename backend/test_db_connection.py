#!/usr/bin/env python3
"""
Test database connection with the provided credentials.
Run this to verify your database connection works.
"""

import os
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

# Your database credentials
DATABASE_URL = "mysql+pymysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@yamabiko.proxy.rlwy.net:27982/railway"

def test_database_connection():
    """Test the database connection"""
    try:
        print("🔌 Testing database connection...")
        
        # Create engine with connection pooling
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            
            # Test if we can create tables
            print("🔧 Testing table creation...")
            from models import Base
            Base.metadata.create_all(bind=engine)
            print("✅ Tables created successfully!")
            
            # Check existing tables
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result.fetchall()]
            print(f"📋 Existing tables: {tables}")
            
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_jwt_configuration():
    """Test JWT configuration"""
    try:
        print("\n🔐 Testing JWT configuration...")
        
        # Your JWT secret key
        JWT_SECRET_KEY = "f60b9f7b63acbcb0598daf1f359f33953d6c004b75d9ef76132aca2bcab560ae"
        
        if len(JWT_SECRET_KEY) >= 32:
            print("✅ JWT secret key is valid (length >= 32)")
        else:
            print("❌ JWT secret key is too short")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ JWT configuration failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Database and JWT Configuration")
    print("=" * 50)
    
    db_success = test_database_connection()
    jwt_success = test_jwt_configuration()
    
    print("\n" + "=" * 50)
    if db_success and jwt_success:
        print("🎉 All tests passed! Your configuration is ready for deployment.")
        print("\n📋 Next steps:")
        print("1. Set these environment variables in your Render dashboard:")
        print("   DATABASE_URL=mysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@yamabiko.proxy.rlwy.net:27982/railway")
        print("   JWT_SECRET_KEY=f60b9f7b63acbcb0598daf1f359f33953d6c004b75d9ef76132aca2bcab560ae")
        print("2. Deploy your application")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main() 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import auth, movies, theaters, shows, bookings
from database import engine
from models import Base
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Ticket Booking API",
    description="API for managing movie ticket bookings",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(theaters.router)
app.include_router(shows.router)
app.include_router(bookings.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to the Movie Ticket Booking API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

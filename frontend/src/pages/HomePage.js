import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="logo">Movie Ticket Booking</div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/movies">Movies</Link></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><Link to="/signup" className="nav-button">Sign Up</Link></li>
                    <li><Link to="/login" className="nav-button">Login</Link></li>
                </ul>
            </nav>
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Book Your Favorite Movies Now!</h1>
                    <p>Find the latest movies and book your tickets online with ease.</p>
                    <Link to="/movies" className="btn">View Movies</Link>
                </div>
            </header>
            <footer className="footer">
                <p>&copy; 2024 Movie Ticket Booking. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;

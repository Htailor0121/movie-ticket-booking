import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../api';
import './Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const response = await getBookings();
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch bookings');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'green';
            case 'pending':
                return 'orange';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    if (!user) {
        return (
            <div className="bookings-page">
                <h2>My Bookings</h2>
                <p>Please log in to view your bookings.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bookings-page">
                <h2>My Bookings</h2>
                <p>Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-page">
                <h2>My Bookings</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You haven't made any bookings yet.</p>
                    <a href="/movies" className="browse-movies-btn">Browse Movies</a>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h3>{booking.show.movie.title}</h3>
                                <span 
                                    className={`status ${getStatusColor(booking.payment_status)}`}
                                >
                                    {booking.payment_status}
                                </span>
                            </div>
                            <div className="booking-details">
                                <p><strong>Theater:</strong> {booking.show.theater.name}</p>
                                <p><strong>Show Time:</strong> {formatDate(booking.show.show_time)}</p>
                                <p><strong>Seats:</strong> {booking.seat_numbers.join(', ')}</p>
                                <p><strong>Total Amount:</strong> ₹{booking.total_amount}</p>
                                <p><strong>Booking Date:</strong> {formatDate(booking.booking_time)}</p>
                            </div>
                            {booking.payment_status === 'pending' && (
                                <div className="booking-actions">
                                    <button className="pay-btn">Pay Now</button>
                                    <button className="cancel-btn">Cancel</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings; 
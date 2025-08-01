import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTheaters, getShowsByTheater } from '../api';
import './Theaters.css';

const Theaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [theaterShows, setTheaterShows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const response = await getTheaters();
            setTheaters(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch theaters');
            setLoading(false);
        }
    };

    const handleTheaterClick = async (theater) => {
        try {
            setSelectedTheater(theater);
            const response = await getShowsByTheater(theater.id);
            setTheaterShows(response.data);
        } catch (err) {
            console.error('Failed to fetch theater shows:', err);
            setTheaterShows([]);
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

    const handleShowClick = (show) => {
        navigate(`/seat-selection/${show.movie.id}`);
    };

    if (loading) {
        return (
            <div className="theaters-page">
                <h2>Our Theaters</h2>
                <p>Loading theaters...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="theaters-page">
                <h2>Our Theaters</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="theaters-page">
            <h2>Our Theaters</h2>
            
            <div className="theaters-container">
                <div className="theaters-list">
                    <h3>Select a Theater</h3>
                    {theaters.map((theater) => (
                        <div
                            key={theater.id}
                            className={`theater-item ${selectedTheater?.id === theater.id ? 'selected' : ''}`}
                            onClick={() => handleTheaterClick(theater)}
                        >
                            <h4>{theater.name}</h4>
                            <p>{theater.location}</p>
                            <p>Capacity: {theater.total_seats} seats</p>
                        </div>
                    ))}
                </div>

                <div className="theater-shows">
                    {selectedTheater ? (
                        <>
                            <h3>Shows at {selectedTheater.name}</h3>
                            {theaterShows.length === 0 ? (
                                <p>No shows scheduled at this theater.</p>
                            ) : (
                                <div className="shows-grid">
                                    {theaterShows.map((show) => (
                                        <div key={show.id} className="show-card" onClick={() => handleShowClick(show)}>
                                            <img src={show.movie.poster_url} alt={show.movie.title} />
                                            <div className="show-info">
                                                <h4>{show.movie.title}</h4>
                                                <p>{show.movie.genre}</p>
                                                <p>Time: {formatDate(show.show_time)}</p>
                                                <p>Price: ₹{show.price}</p>
                                                <p>Available Seats: {show.available_seats}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-theater-selected">
                            <h3>Select a theater to view shows</h3>
                            <p>Click on any theater from the list to see what's playing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Theaters; 
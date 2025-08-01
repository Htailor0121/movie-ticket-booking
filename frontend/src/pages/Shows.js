import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShows, getMovies, getTheaters } from '../api';
import './Shows.css';

const Shows = () => {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        movie: '',
        theater: '',
        date: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [showsResponse, moviesResponse, theatersResponse] = await Promise.all([
                getShows(),
                getMovies(),
                getTheaters()
            ]);
            setShows(showsResponse.data);
            setMovies(moviesResponse.data);
            setTheaters(theatersResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch shows data');
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const getFilteredShows = () => {
        let filtered = shows;

        if (filters.movie) {
            filtered = filtered.filter(show => show.movie.id === parseInt(filters.movie));
        }

        if (filters.theater) {
            filtered = filtered.filter(show => show.theater.id === parseInt(filters.theater));
        }

        if (filters.date) {
            const filterDate = new Date(filters.date);
            filtered = filtered.filter(show => {
                const showDate = new Date(show.show_time);
                return showDate.toDateString() === filterDate.toDateString();
            });
        }

        return filtered;
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

    const filteredShows = getFilteredShows();

    if (loading) {
        return (
            <div className="shows-page">
                <h2>All Shows</h2>
                <p>Loading shows...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shows-page">
                <h2>All Shows</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="shows-page">
            <h2>All Shows</h2>
            
            <div className="filters-section">
                <h3>Filter Shows</h3>
                <div className="filters">
                    <select
                        value={filters.movie}
                        onChange={(e) => handleFilterChange('movie', e.target.value)}
                    >
                        <option value="">All Movies</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.theater}
                        onChange={(e) => handleFilterChange('theater', e.target.value)}
                    >
                        <option value="">All Theaters</option>
                        {theaters.map(theater => (
                            <option key={theater.id} value={theater.id}>
                                {theater.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                    />

                    <button
                        className="clear-filters"
                        onClick={() => setFilters({ movie: '', theater: '', date: '' })}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="shows-results">
                <h3>Available Shows ({filteredShows.length})</h3>
                
                {filteredShows.length === 0 ? (
                    <div className="no-shows">
                        <p>No shows found with the selected filters.</p>
                        <button onClick={() => setFilters({ movie: '', theater: '', date: '' })}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="shows-grid">
                        {filteredShows.map((show) => (
                            <div key={show.id} className="show-card" onClick={() => handleShowClick(show)}>
                                <img src={show.movie.poster_url} alt={show.movie.title} />
                                <div className="show-info">
                                    <h4>{show.movie.title}</h4>
                                    <p className="genre">{show.movie.genre}</p>
                                    <p className="theater">{show.theater.name}</p>
                                    <p className="location">{show.theater.location}</p>
                                    <p className="time">{formatDate(show.show_time)}</p>
                                    <p className="price">₹{show.price}</p>
                                    <p className="seats">Available: {show.available_seats} seats</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shows; 
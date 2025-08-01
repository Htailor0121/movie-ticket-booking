    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getMovies } from '../api';
    import './MoviesPage.css';

    const MoviesPage = () => {
        const navigate = useNavigate();
        const [movies, setMovies] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            fetchMovies();
        }, []);

        const fetchMovies = async () => {
            try {
                const response = await getMovies();
                setMovies(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch movies');
                setLoading(false);
            }
        };

        const handleMovieClick = (id) => {
            navigate(`/movies/${id}`);
        };

        if (loading) {
            return (
                <div className="movies-page">
                    <h2>Available Movies</h2>
                    <p>Loading movies...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="movies-page">
                    <h2>Available Movies</h2>
                    <p className="error">{error}</p>
                </div>
            );
        }

        return (
            <div className="movies-page">
                <h2>Available Movies</h2>
                <div className="movies-grid">
                    {movies.length > 0 ? (
                        movies.map((movie, index) => (
                            <div key={index} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                                <img src={movie.poster_url} alt={movie.title} />
                                <h3>{movie.title}</h3>
                                <p>{movie.genre}</p>
                                <p>Price: ₹{movie.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No movies available</p>
                    )}
                </div>
            </div>
        );
    };

    export default MoviesPage;

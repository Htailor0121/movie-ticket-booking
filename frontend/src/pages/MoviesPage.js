    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import movies from './moviesData'; // ✅ CORRECT
    import './MoviesPage.css';

    const MoviesPage = () => {
        const navigate = useNavigate();
        
        // Check if movies data is available
        console.log(movies); 

        const handleMovieClick = (id) => {
            navigate(`/seat-selection/${id}`);
        };

        return (
            <div className="movies-page">
                <h2>Available Movies</h2>
                <div className="movies-grid">
                    {movies.length > 0 ? (
                        movies.map((movie, index) => (
                            <div key={index} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                                <img src={movie.image} alt={movie.title} />
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

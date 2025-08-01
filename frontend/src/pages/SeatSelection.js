import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getShowsByMovie } from '../api';
import './SeatSelection.css';

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

// Mock some booked seats for demo
const bookedSeats = ['A-2', 'B-5', 'C-1', 'F-4', 'G-2', 'I-7'];

const SeatSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieAndShows();
  }, [movieId]);

  const fetchMovieAndShows = async () => {
    try {
      const [movieResponse, showsResponse] = await Promise.all([
        getMovieById(movieId),
        getShowsByMovie(movieId)
      ]);
      setMovie(movieResponse.data);
      setShows(showsResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movie and shows');
      setLoading(false);
    }
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
  };

  const handleSeatClick = (seatId) => {
    if (!selectedShow) return;
    
    // Check if seat is already booked
    const isBooked = selectedShow.bookings?.some(booking => 
      booking.payment_status === 'completed' && 
      booking.seat_numbers.includes(seatId)
    );
    
    if (isBooked) return;

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : prev.length < 6
          ? [...prev, seatId]
          : prev
    );
  };

  const handleProceedToPayment = () => {
    if (!selectedShow || selectedSeats.length === 0) return;
    
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalPrice', selectedSeats.length * selectedShow.price);
    localStorage.setItem('movieTitle', movie.title);
    localStorage.setItem('showId', selectedShow.id);
    navigate(`/payment`);
  };

  if (loading) return <div className="seat-selection">Loading...</div>;
  if (error) return <div className="seat-selection">Error: {error}</div>;
  if (!movie) return <div className="seat-selection">Movie not found</div>;

  return (
    <div className="seat-selection">
      <h2>Select Seats for {movie.title}</h2>
      <p>{movie.genre} • ₹{selectedShow?.price || movie.price} per seat</p>

      {shows.length > 0 && (
        <div className="show-selection">
          <h3>Select a Show:</h3>
          <div className="shows-grid">
            {shows.map((show) => (
              <button
                key={show.id}
                className={`show-option ${selectedShow?.id === show.id ? 'selected' : ''}`}
                onClick={() => handleShowSelect(show)}
              >
                <div>{new Date(show.show_time).toLocaleDateString()}</div>
                <div>{new Date(show.show_time).toLocaleTimeString()}</div>
                <div>₹{show.price}</div>
              </button>
            ))}
          </div>
        </div>
      )}

            {selectedShow && (
        <>
          <div className="screen">SCREEN</div>

          <div className="seat-grid">
            {rows.map((row) =>
              cols.map((col) => {
                const seatId = `${row}-${col}`;
                const isBooked = selectedShow.bookings?.some(booking => 
                  booking.payment_status === 'completed' && 
                  booking.seat_numbers.includes(seatId)
                );
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`}
                    disabled={isBooked}
                    onClick={() => handleSeatClick(seatId)}
                  >
                    💺
                  </button>
                );
              })
            )}
          </div>

          <div className="legend">
            <span><span className="dot available" /> Available</span>
            <span><span className="dot selected" /> Selected</span>
            <span><span className="dot booked" /> Booked</span>
          </div>

          <div className="summary">
            <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
            <p>Total Amount: ₹{selectedSeats.length * selectedShow.price}</p>

            {selectedSeats.length > 0 && (
              <button className="payment-button" onClick={handleProceedToPayment}>
                PROCEED TO PAYMENT
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SeatSelection;

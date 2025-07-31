import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movies from './moviesData';
import './SeatSelection.css';

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

// Mock some booked seats for demo
const bookedSeats = ['A-2', 'B-5', 'C-1', 'F-4', 'G-2', 'I-7'];

const SeatSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id === parseInt(movieId));

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : prev.length < 6
          ? [...prev, seatId]
          : prev
    );
  };

  const handleProceedToPayment = () => {
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalPrice', selectedSeats.length * movie.price);
    localStorage.setItem('movieTitle', movie.title);
    navigate(`/payment`);
  };

  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="seat-selection">
      <h2>Select Seats for {movie.title}</h2>
      <p>{movie.genre} • ₹{movie.price} per seat</p>

      <div className="screen">SCREEN</div>

      <div className="seat-grid">
        {rows.map((row) =>
          cols.map((col) => {
            const seatId = `${row}-${col}`;
            const isBooked = bookedSeats.includes(seatId);
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
        <p>Total Amount: ₹{selectedSeats.length * movie.price}</p>

        {selectedSeats.length > 0 && (
          <button className="payment-button" onClick={handleProceedToPayment}>
            PROCEED TO PAYMENT
          </button>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;

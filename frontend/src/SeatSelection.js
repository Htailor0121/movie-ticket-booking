import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SeatSelection.css';

// Define seat prices based on seat numbers
const seatPrices = {
    1: 800,
    2: 600,
    3: 1000,
    4: 1200,
    5: 900,
};

const SeatSelection = () => {
    const { title } = useParams(); // Get the movie title from URL parameters
    const [selectedSeats, setSelectedSeats] = useState([]); // State to keep track of selected seats
    const navigate = useNavigate(); // Hook to programmatically navigate
    const totalPrice = selectedSeats.reduce((total, seat) => total + (seatPrices[seat] || 600), 0); // Calculate total price based on selected seats

    // Create an array of 50 seats
    const seats = Array.from({ length: 50 }, (_, index) => index + 1);

    // Function to toggle seat selection
    const toggleSeatSelection = (seat) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seat)
                ? prevSelectedSeats.filter((s) => s !== seat) // Remove seat if already selected
                : [...prevSelectedSeats, seat] // Add seat if not selected
        );
    };

    // Handle the proceed action to navigate to the payment page
    const handleProceed = () => {
        if (selectedSeats.length > 0) {
            const selectedTime = "12:00 PM"; // Replace this with your actual selected time logic
            navigate(`/payment/${title}/${selectedTime}/${totalPrice}`);
        } else {
            alert("Please select at least one seat.");
        }
    };
    

    return (
        <div className="seat-selection">
            <h2>{title} - Select Your Seats</h2>
            <div className="seats-grid">
                {seats.map((seat) => (
                    <div
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`} // Highlight selected seats
                        onClick={() => toggleSeatSelection(seat)} // Handle seat click
                    >
                        <span>Seat {seat}</span> - <span>₹{seatPrices[seat] || 600}</span>
                    </div>
                ))}
            </div>
            {selectedSeats.length > 0 && (
                <>
                    <h4>Total Price: ₹{totalPrice}</h4>
                    <button onClick={handleProceed} className="proceed-button">Proceed to Payment</button>
                </>
            )}
        </div>
    );
};

export default SeatSelection;

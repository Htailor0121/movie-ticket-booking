import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookingData, setBookingData] = useState(null);

    const paymentMethods = [
        { name: 'Credit Card', img: 'https://img.freepik.com/free-vector/black-credit-card_1017-6276.jpg?size=338&ext=jpg&ga=GA1.1.1887574231.1729036800&semt=ais_hybrid' },
        { name: 'Debit Card', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ3u4YFF39K7pxBSUCWIDW0L9C3B5_b7cADw&s' },
        { name: 'PayPal', img: 'https://www.citypng.com/public/uploads/preview/transparent-hd-paypal-logo-701751694777788ilpzr3lary.png' },
        { name: 'Google Pay', img: 'https://w7.pngwing.com/pngs/191/51/png-transparent-google-pay-or-tez-hd-logo-thumbnail.png' }
    ];

    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });
    const [cardErrors, setCardErrors] = useState({ cardNumber: '', expiry: '', cvv: '' }); // Validation errors for card details
    const [upiId, setUpiId] = useState('');
    const [upiError, setUpiError] = useState(''); // State for UPI ID error
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Get booking data from localStorage
        const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
        const totalPrice = localStorage.getItem('totalPrice');
        const movieTitle = localStorage.getItem('movieTitle');
        const showId = localStorage.getItem('showId');

        if (!selectedSeats.length || !totalPrice || !showId) {
            toast.error('Invalid booking data. Please select seats again.');
            navigate('/movies');
            return;
        }

        setBookingData({
            show_id: parseInt(showId),
            num_seats: selectedSeats.length,
            total_amount: parseFloat(totalPrice),
            seat_numbers: selectedSeats
        });
    }, [navigate]);

    const handlePayment = (method) => {
        setSelectedMethod(method);
        setUpiError(''); // Reset UPI error on method change
        setModalOpen(true); // Open the modal
    };

    const handleCardChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
        setCardErrors({ ...cardErrors, [e.target.name]: '' }); // Clear the error when user starts typing
    };

    const handleUpiChange = (e) => {
        setUpiId(e.target.value);
    };

    const validateCardDetails = () => {
        let errors = {};
        let isValid = true;

        // Validate card number
        if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
            errors.cardNumber = 'Please enter a valid 16-digit card number.';
            isValid = false;
        }

        // Validate expiry date
        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // Format: MM/YY
        if (!cardDetails.expiry || !expiryRegex.test(cardDetails.expiry)) {
            errors.expiry = 'Please enter a valid expiry date (MM/YY).';
            isValid = false;
        }

        // Validate CVV
        if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
            errors.cvv = 'Please enter a valid CVV.';
            isValid = false;
        }

        setCardErrors(errors);
        return isValid;
    };

    const validateUpiId = (id) => {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/; // Basic UPI ID regex
        return upiRegex.test(id);
    };

    const processPayment = async () => {
        if (!user) {
            toast.error('Please log in to make a booking.');
            navigate('/login');
            return;
        }

        if (!bookingData) {
            toast.error('No booking data available.');
            return;
        }

        setLoading(true);
        setPaymentSuccess(null);

        // Validate card details if selected method is card-based
        if (selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') {
            if (!validateCardDetails()) {
                setLoading(false);
                return;
            }
        }

        // Validate UPI ID if using Google Pay or PayPal
        if (selectedMethod === 'Google Pay' || selectedMethod === 'PayPal') {
            if (!validateUpiId(upiId)) {
                setLoading(false);
                setUpiError('Please enter a valid UPI ID.');
                return;
            }
        }

        try {
            // Create the booking
            await createBooking(bookingData);
            
            // Clear localStorage
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('totalPrice');
            localStorage.removeItem('movieTitle');
            localStorage.removeItem('showId');
            
            setLoading(false);
            setPaymentSuccess(`Booking successful! Payment completed using ${selectedMethod}.`);
            setModalOpen(false);
            
            toast.success('Booking created successfully!');
            
            // Redirect to bookings page after 2 seconds
            setTimeout(() => {
                navigate('/bookings');
            }, 2000);
            
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.detail || 'Failed to create booking.');
        }
    };

    const handleCancel = () => {
        setModalOpen(false); // Close modal when user clicks "Cancel"
        setSelectedMethod(null); // Reset selected method
        setCardDetails({ cardNumber: '', expiry: '', cvv: '' }); // Clear card details
        setUpiId(''); // Clear UPI ID
        setUpiError(''); // Clear UPI error
        setCardErrors({ cardNumber: '', expiry: '', cvv: '' }); // Clear card errors
        setPaymentSuccess(null); // Reset success message
    };

    if (!bookingData) {
        return (
            <div className="payment">
                <h2>Loading booking details...</h2>
            </div>
        );
    }

    return (
        <div className="payment">
            <h2>Select Payment Method</h2>
            <div className="booking-summary">
                <h3>Booking Summary</h3>
                <p><strong>Movie:</strong> {localStorage.getItem('movieTitle')}</p>
                <p><strong>Seats:</strong> {bookingData.seat_numbers.join(', ')}</p>
                <p><strong>Total Amount:</strong> ₹{bookingData.total_amount}</p>
            </div>

            <div className="payment-methods">
                {paymentMethods.map((method, index) => (
                    <div key={index} className="payment-card" onClick={() => handlePayment(method.name)}>
                        <img src={method.img} alt={method.name} />
                        <h3>{method.name}</h3>
                    </div>
                ))}
            </div>

            {/* Modal for payment options */}
            <Modal isOpen={isModalOpen} onClose={handleCancel}>
                {loading && <p>Processing your payment... Please wait.</p>}
                {paymentSuccess && <p className="success">{paymentSuccess}</p>}
                {upiError && <p className="error">{upiError}</p>}

                {selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card' ? (
                    <div className="card-details">
                        <h4>Enter Card Details</h4>
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number"
                            value={cardDetails.cardNumber}
                            onChange={handleCardChange}
                            required
                        />
                        {cardErrors.cardNumber && <p className="error">{cardErrors.cardNumber}</p>}
                        
                        <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            required
                        />
                        {cardErrors.expiry && <p className="error">{cardErrors.expiry}</p>}

                        <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            required
                        />
                        {cardErrors.cvv && <p className="error">{cardErrors.cvv}</p>}
                    </div>
                ) : selectedMethod === 'Google Pay' || selectedMethod === 'PayPal' ? (
                    <div className="upi-details">
                        <h4>Enter UPI ID</h4>
                        <input
                            type="text"
                            placeholder="Enter your UPI ID"
                            value={upiId}
                            onChange={handleUpiChange}
                            required
                        />
                    </div>
                ) : null}

                <div className="modal-actions">
                    <button
                        onClick={processPayment}
                        className="pay-button"
                        disabled={loading} // Disable button while processing
                    >
                        Pay Now
                    </button>
                    <button onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default Payment;

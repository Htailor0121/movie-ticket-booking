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
    const [cardErrors, setCardErrors] = useState({ cardNumber: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [upiError, setUpiError] = useState('');

    useEffect(() => {
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
        setPaymentSuccess(null);
        setUpiError('');
        setCardErrors({ cardNumber: '', expiry: '', cvv: '' });
        setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
        setUpiId('');
    };

    const handleCardChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
        setCardErrors({ ...cardErrors, [e.target.name]: '' });
    };

    const handleUpiChange = (e) => {
        setUpiId(e.target.value);
        setUpiError('');
    };

    const validateCardDetails = () => {
        let errors = {};
        let isValid = true;

        if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
            errors.cardNumber = 'Please enter a valid 16-digit card number.';
            isValid = false;
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!cardDetails.expiry || !expiryRegex.test(cardDetails.expiry)) {
            errors.expiry = 'Please enter a valid expiry date (MM/YY).';
            isValid = false;
        }

        if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
            errors.cvv = 'Please enter a valid CVV.';
            isValid = false;
        }

        setCardErrors(errors);
        return isValid;
    };

    const validateUpiId = (id) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(id);

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

        if ((selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') && !validateCardDetails()) {
            setLoading(false);
            return;
        }

        if ((selectedMethod === 'Google Pay' || selectedMethod === 'PayPal') && !validateUpiId(upiId)) {
            setLoading(false);
            setUpiError('Please enter a valid UPI ID.');
            return;
        }

        try {
            await createBooking(bookingData);
            localStorage.clear();
            setLoading(false);
            setPaymentSuccess(`Booking successful! Payment completed using ${selectedMethod}.`);
            toast.success('Booking created successfully!');
            setTimeout(() => navigate('/bookings'), 2000);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.detail || 'Failed to create booking.');
        }
    };

    const handleCancel = () => {
        setSelectedMethod(null);
        setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
        setUpiId('');
        setUpiError('');
        setCardErrors({ cardNumber: '', expiry: '', cvv: '' });
        setPaymentSuccess(null);
    };

    if (!bookingData) {
        return <div className="payment"><h2>Loading booking details...</h2></div>;
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

            {selectedMethod && (
                <div className="payment-form">
                    <h4>{selectedMethod} Details</h4>
                    {loading && <p>Processing your payment... Please wait.</p>}
                    {paymentSuccess && <p className="success">{paymentSuccess}</p>}
                    {upiError && <p className="error">{upiError}</p>}

                    {(selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') && (
                        <>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number"
                                value={cardDetails.cardNumber}
                                onChange={handleCardChange}
                            />
                            {cardErrors.cardNumber && <p className="error">{cardErrors.cardNumber}</p>}

                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={handleCardChange}
                            />
                            {cardErrors.expiry && <p className="error">{cardErrors.expiry}</p>}

                            <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                value={cardDetails.cvv}
                                onChange={handleCardChange}
                            />
                            {cardErrors.cvv && <p className="error">{cardErrors.cvv}</p>}
                        </>
                    )}

                    {(selectedMethod === 'Google Pay' || selectedMethod === 'PayPal') && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter your UPI ID"
                                value={upiId}
                                onChange={handleUpiChange}
                            />
                            {upiError && <p className="error">{upiError}</p>}
                        </>
                    )}

                    <div className="modal-actions">
                        <button onClick={processPayment} className="pay-button" disabled={loading}>Pay Now</button>
                        <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;

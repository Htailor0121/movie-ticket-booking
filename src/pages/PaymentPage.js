import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { CreditCard, AccountBalance, Payment } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/${bookingId}`);
      setBookingDetails(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch booking details');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // Validate payment details
      if (paymentMethod === 'card') {
        if (!cardNumber || !expiryDate || !cvv) {
          toast.error('Please fill in all card details');
          return;
        }
      }

      // Simulate payment processing
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update booking status
      await axios.put(`http://localhost:8000/bookings/${bookingId}`, {
        payment_status: 'completed',
        payment_method: paymentMethod
      });

      toast.success('Payment successful!');
      navigate('/profile'); // Redirect to profile page after successful payment
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment Details
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Booking Summary
          </Typography>
          <Typography>Movie: {bookingDetails?.show?.movie?.title}</Typography>
          <Typography>Theater: {bookingDetails?.show?.theater?.name}</Typography>
          <Typography>Show Time: {new Date(bookingDetails?.show?.show_time).toLocaleString()}</Typography>
          <Typography>Number of Seats: {bookingDetails?.num_seats}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Amount: ₹{bookingDetails?.total_amount}
          </Typography>
        </Box>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCard sx={{ mr: 1 }} />
                  Credit/Debit Card
                </Box>
              }
            />
            <FormControlLabel
              value="upi"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Payment sx={{ mr: 1 }} />
                  UPI
                </Box>
              }
            />
            <FormControlLabel
              value="netbanking"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  Net Banking
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'card' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                type="password"
                placeholder="123"
              />
            </Grid>
          </Grid>
        )}

        {paymentMethod === 'upi' && (
          <TextField
            fullWidth
            label="UPI ID"
            placeholder="username@upi"
            sx={{ mb: 2 }}
          />
        )}

        {paymentMethod === 'netbanking' && (
          <TextField
            fullWidth
            select
            label="Select Bank"
            defaultValue=""
            sx={{ mb: 2 }}
          >
            {/* Add bank options here */}
          </TextField>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePayment}
          sx={{ mt: 3 }}
        >
          Pay ₹{bookingDetails?.total_amount}
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentPage; 
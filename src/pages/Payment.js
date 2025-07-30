import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { getBookings } from '../api';
import { toast } from 'react-toastify';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookings();
        const currentBooking = response.data.find(b => b.id === parseInt(bookingId));
        if (!currentBooking) {
          throw new Error('Booking not found');
        }
        setBooking(currentBooking);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // In a real application, you would integrate with a payment gateway here
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking with payment information
      // await updatePayment(bookingId, 'DEMO_PAYMENT_ID');
      
      toast.success('Payment successful!');
      navigate('/profile');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container>
        <Typography>Booking not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Booking ID: {booking.id}
              </Typography>
              <Typography variant="body1">
                Movie: {booking.movie_title}
              </Typography>
              <Typography variant="body1">
                Show Time: {new Date(booking.show_time).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Seats: {booking.seats.join(', ')}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Amount: ₹{booking.total_amount}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                margin="normal"
                required
                placeholder="1234 5678 9012 3456"
              />
              <TextField
                fullWidth
                label="Cardholder Name"
                name="cardName"
                value={paymentDetails.cardName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    placeholder="123"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={processing}
              >
                {processing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </Box>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Payment; 
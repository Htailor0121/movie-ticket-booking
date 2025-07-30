import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import SeatLayout from '../components/SeatLayout';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [seatLockTimer, setSeatLockTimer] = useState(null);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

  useEffect(() => {
    fetchShowDetails();
    return () => {
      // Cleanup: Unlock seats when component unmounts
      if (selectedSeats.length > 0) {
        unlockSeats();
      }
      if (seatLockTimer) {
        clearInterval(seatLockTimer);
      }
    };
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/shows/${showId}`);
      setShowDetails(response.data);
      setLockedSeats(response.data.locked_seats || []);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch show details');
      setLoading(false);
    }
  };

  const lockSeats = async (seats) => {
    try {
      const response = await axios.post(`http://localhost:8000/shows/${showId}/lock-seats`, {
        seat_numbers: seats
      });
      
      setLockedSeats(seats);
      startSeatLockTimer(response.data.expiry_time);
      return true;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to lock seats');
      }
      return false;
    }
  };

  const unlockSeats = async () => {
    try {
      await axios.post(`http://localhost:8000/shows/${showId}/unlock-seats`, {
        seat_numbers: selectedSeats
      });
      setLockedSeats([]);
      if (seatLockTimer) {
        clearInterval(seatLockTimer);
      }
    } catch (error) {
      console.error('Failed to unlock seats:', error);
    }
  };

  const startSeatLockTimer = (expiryTime) => {
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      
      if (now >= expiry) {
        clearInterval(timer);
        setShowTimeoutDialog(true);
        unlockSeats();
      }
    }, 1000);
    
    setSeatLockTimer(timer);
  };

  const handleSeatSelection = async (seat) => {
    if (lockedSeats.includes(seat)) {
      toast.error('This seat is currently locked by another user');
      return;
    }

    const newSelectedSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter(s => s !== seat)
      : [...selectedSeats, seat];

    if (newSelectedSeats.length > 0) {
      const success = await lockSeats(newSelectedSeats);
      if (!success) {
        return;
      }
    } else {
      await unlockSeats();
    }

    setSelectedSeats(newSelectedSeats);
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:8000/bookings/', {
        show_id: showId,
        num_seats: selectedSeats.length,
        total_amount: showDetails.price * selectedSeats.length,
        seat_numbers: selectedSeats
      });
      
      toast.success('Booking successful!');
      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create booking');
      console.error('Booking error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Book Tickets
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {showDetails.movie.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {showDetails.theater.name} - {new Date(showDetails.show_time).toLocaleString()}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <SeatLayout
                totalSeats={showDetails.theater.total_seats}
                selectedSeats={selectedSeats}
                lockedSeats={lockedSeats}
                onSeatSelect={handleSeatSelection}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Typography variant="body1">
              Selected Seats: {selectedSeats.join(', ') || 'None'}
            </Typography>
            <Typography variant="body1">
              Price per Seat: ₹{showDetails.price}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Amount: ₹{showDetails.price * selectedSeats.length}
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              sx={{ mt: 3 }}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={showTimeoutDialog}
        onClose={() => setShowTimeoutDialog(false)}
      >
        <DialogTitle>Seat Lock Expired</DialogTitle>
        <DialogContent>
          <Typography>
            Your seat selection has expired. Please select your seats again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTimeoutDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingPage; 
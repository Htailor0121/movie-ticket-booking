import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { getMovieById, getShowsByMovie, createBooking } from '../api';
import { toast } from 'react-toastify';

const SeatSelection = () => {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(null);
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, showData] = await Promise.all([
          getMovieById(movieId),
          getShowsByMovie(movieId),
        ]);

        const currentShow = showData.data.find(s => s.id === parseInt(showId));
        if (!currentShow) {
          throw new Error('Show not found');
        }

        setMovie(movieData.data);
        setShow(currentShow);
        setTheater(currentShow.theater);
        setBookedSeats(currentShow.booked_seats || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, showId]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      }
      return [...prev, seatNumber];
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      const bookingData = {
        show_id: parseInt(showId),
        seats: selectedSeats,
        total_amount: selectedSeats.length * show.price,
      };

      const booking = await createBooking(bookingData);
      toast.success('Booking successful!');
      navigate(`/payment/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!movie || !show || !theater) {
    return (
      <Container>
        <Typography>Show details not found</Typography>
      </Container>
    );
  }

  const renderSeats = () => {
    const rows = 8;
    const seatsPerRow = 10;
    const seats = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = (row - 1) * seatsPerRow + seat;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        rowSeats.push(
          <Box
            key={seatNumber}
            sx={{
              width: 40,
              height: 40,
              m: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isBooked ? 'not-allowed' : 'pointer',
              bgcolor: isBooked ? 'grey.300' : isSelected ? 'primary.main' : 'grey.100',
              color: isSelected ? 'white' : 'text.primary',
              borderRadius: 1,
              '&:hover': {
                bgcolor: isBooked ? 'grey.300' : isSelected ? 'primary.dark' : 'grey.200',
              },
            }}
            onClick={() => handleSeatClick(seatNumber)}
          >
            {seatNumber}
          </Box>
        );
      }
      seats.push(
        <Box key={row} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Row {row}
          </Typography>
          {rowSeats}
        </Box>
      );
    }

    return seats;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select Seats
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {theater.name} • {new Date(show.start_time).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: 'grey.100',
                    mr: 1,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: 'primary.main',
                    mr: 1,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: 'grey.300',
                    mr: 1,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Booked</Typography>
              </Box>
            </Box>
            {renderSeats()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Selected Seats: {selectedSeats.length}
              </Typography>
              <Typography variant="body1">
                Price per seat: ₹{show.price}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Amount: ₹{selectedSeats.length * show.price}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatSelection; 
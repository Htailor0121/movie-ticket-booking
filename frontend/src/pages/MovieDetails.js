import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Chip,
  Rating,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { getMovieById, getShowsByMovie } from '../api/index';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    let isMounted = true;
    fetchMovieDetails(isMounted);
    return () => { isMounted = false; };
  }, [id]);

  const fetchMovieDetails = async (isMounted) => {
    try {
      const [movieData, showsData] = await Promise.all([
        getMovieById(id),
        getShowsByMovie(id)
      ]);
      if (isMounted) {
        setMovie(movieData.data);
        setShows(showsData.data);
      }
      if (isMounted) setLoading(false);
    } catch (err) {
      if (isMounted) setError('Failed to fetch movie details. Please try again later.');
      if (isMounted) setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/seat-selection/${id}`);
  };

  const getShowsForDate = (date) => {
    return shows.filter(show => {
      const showDate = new Date(show.show_time);
      return showDate.toDateString() === date.toDateString();
    });
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
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
    <Box sx={{ pt: 8 }}>
      {/* Movie Header */}
      <Box
        sx={{
          position: 'relative',
          height: '50vh',
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${movie.poster_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3}>
              <CardMedia
                component="img"
                image={movie.poster_url}
                alt={movie.title}
                sx={{ borderRadius: 2, boxShadow: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h3" component="h1" gutterBottom>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={movie.genre} color="primary" />
                <Chip label={`${movie.duration} min`} variant="outlined" />
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body1">(4.5/5)</Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                {movie.release_date}
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.description}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setSelectedTab(1)}
                sx={{ mt: 2 }}
              >
                Book Tickets
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Movie Details and Booking */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="About" />
          <Tab label="Book Tickets" />
          <Tab label="Reviews" />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              About the Movie
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Cast & Crew
            </Typography>
            <Typography variant="body1" paragraph>
              Director: {movie.director || 'N/A'}
            </Typography>
            <Typography variant="body1" paragraph>
              Cast: {movie.cast || 'N/A'}
            </Typography>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select Date
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, overflowX: 'auto', pb: 2 }}>
              {dates.map((date) => (
                <Paper
                  key={date.toISOString()}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: selectedDate.toDateString() === date.toDateString() ? 'primary.main' : 'background.paper',
                    color: selectedDate.toDateString() === date.toDateString() ? 'white' : 'text.primary',
                  }}
                  onClick={() => handleDateSelect(date)}
                >
                  <Typography variant="subtitle2">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Typography>
                  <Typography variant="body1">
                    {date.getDate()}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Typography variant="h5" gutterBottom>
              Available Shows
            </Typography>
            {getShowsForDate(selectedDate).length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No shows available for the selected date.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Theater</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Show Time</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Available Seats</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getShowsForDate(selectedDate).map((show) => (
                      <TableRow key={show.id}>
                        <TableCell>{show.theater.name}</TableCell>
                        <TableCell>{show.theater.location}</TableCell>
                        <TableCell>
                          {new Date(show.show_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>₹{show.price}</TableCell>
                        <TableCell>{show.available_seats}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBookNow}
                          >
                            Book Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Reviews
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to review this movie!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetail; 
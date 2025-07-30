import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../api/index';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setFeaturedMovies(data.slice(0, 5)); // Get first 5 movies for featured section
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Action', icon: '🎬' },
    { name: 'Comedy', icon: '😄' },
    { name: 'Drama', icon: '🎭' },
    { name: 'Sci-Fi', icon: '🚀' },
    { name: 'Horror', icon: '👻' },
  ];

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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://source.unsplash.com/random/1920x1080/?movie)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Book Your Movie Tickets
          </Typography>
          <Typography variant="h5" gutterBottom>
            Watch the latest movies in theaters near you
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/movies')}
            sx={{ mt: 2 }}
          >
            Book Now
          </Button>
        </Container>
      </Box>

      {/* Featured Movies Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Movies
        </Typography>
        <Grid container spacing={3}>
          {featuredMovies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster_url || 'https://via.placeholder.com/400x600'}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={movie.genre} size="small" color="primary" />
                    <Chip label={`${movie.duration} min`} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Browse by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item key={category.name} xs={6} sm={4} md={2.4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => navigate(`/movies?genre=${category.name}`)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                    }}
                  >
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {category.icon}
                    </Typography>
                    <Typography variant="h6">{category.name}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/movies/${movie.id}/book`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from watchlist' : 'Added to watchlist');
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="400"
        image={movie.poster_url || 'https://via.placeholder.com/345x400'}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.5} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (4.5/5)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={movie.genre} size="small" color="primary" />
          <Chip label={`${movie.duration} min`} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {movie.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ₹{movie.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton onClick={handleFavorite}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isBookmarked ? "Remove from watchlist" : "Add to watchlist"}>
            <IconButton onClick={handleBookmark}>
              {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleBookNow}
          sx={{ 
            borderRadius: '20px',
            textTransform: 'none',
            px: 3
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard; 
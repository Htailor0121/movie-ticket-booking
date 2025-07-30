import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Movie as MovieIcon,
  LocationOn,
  Phone,
  Email,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || ''
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUser(formData);
      toast.success('Profile updated successfully!');
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      toast.error('Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  // Mock booking history data
  const bookingHistory = [
    {
      id: 1,
      movie: 'The Avengers',
      theater: 'PVR Cinemas',
      date: '2024-03-15',
      time: '19:00',
      seats: ['A1', 'A2'],
      status: 'Completed'
    },
    {
      id: 2,
      movie: 'Inception',
      theater: 'INOX',
      date: '2024-03-20',
      time: '15:45',
      seats: ['B3', 'B4'],
      status: 'Upcoming'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                bgcolor: 'primary.main'
              }}
            >
              {user?.name?.[0] || 'U'}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Email />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Email"
                  secondary={user?.email}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Phone />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Phone"
                  secondary={user?.phone || 'Not provided'}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LocationOn />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="City"
                  secondary={user?.city || 'Not provided'}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Booking History */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking History
            </Typography>
            <List>
              {bookingHistory.map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <MovieIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.movie}
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2">
                            {booking.theater}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {booking.date} at {booking.time}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Seats: {booking.seats.join(', ')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={booking.status}
                      color={booking.status === 'Completed' ? 'success' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 
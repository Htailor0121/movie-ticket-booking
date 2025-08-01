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
  Email
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../api';
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

  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBookingHistory();
    }
  }, [user]);

  const fetchBookingHistory = async () => {
    try {
      const response = await getBookings();
      setBookingHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
    }
  };

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
            {bookingHistory.length === 0 ? (
              <Typography>No bookings yet.</Typography>
            ) : (
              <List>
                {bookingHistory.map((booking, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <MovieIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={booking.movieTitle}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Time: {booking.selectedTime}
                            </Typography>
                            <Typography variant="body2">
                              Seats: {booking.selectedSeats?.join(', ') || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              Payment Method: {booking.method}
                            </Typography>
                            <Typography variant="body2">
                              Total Paid: ₹{booking.totalPrice}
                            </Typography>
                            <Typography variant="body2">
                              Booked On: {booking.date}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
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

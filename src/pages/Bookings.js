import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Movie as MovieIcon,
  CalendarToday,
  AccessTime,
  LocationOn,
  ConfirmationNumber,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Bookings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock booking data
  const bookings = [
    {
      id: 1,
      movie: 'The Avengers',
      theater: 'PVR Cinemas',
      date: '2024-03-15',
      time: '19:00',
      seats: ['A1', 'A2'],
      status: 'Completed',
      bookingId: 'BMS123456',
      amount: 800
    },
    {
      id: 2,
      movie: 'Inception',
      theater: 'INOX',
      date: '2024-03-20',
      time: '15:45',
      seats: ['B3', 'B4'],
      status: 'Upcoming',
      bookingId: 'BMS123457',
      amount: 600
    },
    {
      id: 3,
      movie: 'Animal',
      theater: 'Cinepolis',
      date: '2024-03-25',
      time: '22:15',
      seats: ['C5', 'C6'],
      status: 'Cancelled',
      bookingId: 'BMS123458',
      amount: 1000
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenCancelDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Booking cancelled successfully!');
      handleCloseCancelDialog();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 0) return true;
    if (selectedTab === 1) return booking.status === 'Upcoming';
    if (selectedTab === 2) return booking.status === 'Completed';
    if (selectedTab === 3) return booking.status === 'Cancelled';
    return true;
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
    <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="Upcoming" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>

        {filteredBookings.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No bookings found
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredBookings.map((booking, index) => (
              <React.Fragment key={booking.id}>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <MovieIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">
                          {booking.movie}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === 'Completed'
                              ? 'success'
                              : booking.status === 'Cancelled'
                              ? 'error'
                              : 'primary'
                          }
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOn fontSize="small" />
                          <Typography variant="body2">
                            {booking.theater}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <CalendarToday fontSize="small" />
                          <Typography variant="body2">
                            {booking.date}
                          </Typography>
                          <AccessTime fontSize="small" />
                          <Typography variant="body2">
                            {booking.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ConfirmationNumber fontSize="small" />
                          <Typography variant="body2">
                            Booking ID: {booking.bookingId}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            ₹{booking.amount}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {booking.status === 'Upcoming' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleOpenCancelDialog(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </ListItem>
                {index < filteredBookings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Cancel Booking Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your booking for {selectedBooking?.movie}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            variant="contained"
            startIcon={<Cancel />}
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings; 
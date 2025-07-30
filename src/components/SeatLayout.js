import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Chair } from '@mui/icons-material';

const SeatLayout = ({ totalSeats, selectedSeats, lockedSeats, onSeatSelect }) => {
  const rows = Math.ceil(totalSeats / 10);
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const getSeatColor = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      return 'primary';
    }
    if (lockedSeats.includes(seatNumber)) {
      return 'error';
    }
    return 'action';
  };

  const getSeatTooltip = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      return 'Selected';
    }
    if (lockedSeats.includes(seatNumber)) {
      return 'Locked by another user';
    }
    return 'Available';
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 1,
          maxWidth: '500px',
          margin: '0 auto',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        {seats.map((seatNumber) => (
          <Tooltip key={seatNumber} title={getSeatTooltip(seatNumber)}>
            <IconButton
              onClick={() => onSeatSelect(seatNumber)}
              disabled={lockedSeats.includes(seatNumber)}
              color={getSeatColor(seatNumber)}
              sx={{
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Chair />
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chair color="action" />
          <Typography variant="body2">Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chair color="primary" />
          <Typography variant="body2">Selected</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chair color="error" />
          <Typography variant="body2">Locked</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatLayout; 
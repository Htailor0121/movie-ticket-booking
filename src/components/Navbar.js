import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  InputBase,
  styled,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn,
  Notifications,
  AccountCircle,
  Movie as MovieIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationAnchor, setLocationAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLocationMenu = (event) => {
    setLocationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocationClose = () => {
    setLocationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1f1f1f' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => navigate('/')}
        >
          <MovieIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          MovieTicket
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 2 }}>
          <Button
            color="inherit"
            startIcon={<LocationOn />}
            onClick={handleLocationMenu}
            sx={{ mr: 2 }}
          >
            {user?.city || 'Select City'}
          </Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.name?.[0] || <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/bookings'); handleClose(); }}>
                  My Bookings
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Menu
        anchorEl={locationAnchor}
        open={Boolean(locationAnchor)}
        onClose={handleLocationClose}
      >
        <MenuItem onClick={handleLocationClose}>Mumbai</MenuItem>
        <MenuItem onClick={handleLocationClose}>Delhi</MenuItem>
        <MenuItem onClick={handleLocationClose}>Bangalore</MenuItem>
        <MenuItem onClick={handleLocationClose}>Chennai</MenuItem>
        <MenuItem onClick={handleLocationClose}>Kolkata</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar; 
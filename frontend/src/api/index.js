import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://movie-ticket-booking-0lfj.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------- AUTH ---------------------- //
export const login = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email); // OAuth2 expects 'username' field
  formData.append('password', password);
  return api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const signup = (userData) =>
  api.post('/auth/signup', userData);

export const getCurrentUser = () =>
  api.get('/auth/users/me');

// ---------------------- MOVIES ---------------------- //
export const getMovies = () =>
  api.get('/movies');

export const getMovieById = (id) =>
  api.get(`/movies/${id}`);

// ---------------------- SHOWS ---------------------- //
export const getShows = () =>
  api.get('/shows');

export const getShowById = (id) =>
  api.get(`/shows/${id}`);

export const getShowsByMovie = (movieId) =>
  api.get(`/shows/movie/${movieId}`);

export const getShowsByTheater = (theaterId) =>
  api.get(`/shows/theater/${theaterId}`);

export const lockSeats = (showId, seatNumbers) =>
  api.post(`/shows/${showId}/lock-seats`, { seat_numbers: seatNumbers });

export const unlockSeats = (showId, seatNumbers) =>
  api.post(`/shows/${showId}/unlock-seats`, { seat_numbers: seatNumbers });

// ---------------------- THEATERS ---------------------- //
export const getTheaters = () =>
  api.get('/theaters');

export const getTheaterById = (id) =>
  api.get(`/theaters/${id}`);

// ---------------------- BOOKINGS ---------------------- //
export const createBooking = (bookingData) =>
  api.post('/bookings', bookingData);

export const getBookings = () =>
  api.get('/bookings');

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

// ---------------------- USERS ---------------------- //
export const updateUser = (userData) =>
  api.put('/auth/users/me', userData);

export default api;

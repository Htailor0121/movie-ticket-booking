import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
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
export const login = (email, password) =>
  api.post('/login', { email, password });

export const signup = (userData) =>
  api.post('/signup', userData);

export const getCurrentUser = () =>
  api.get('/users/me');

// ---------------------- MOVIES ---------------------- //
export const getMovies = () =>
  api.get('/movies');

export const getMovieById = (id) =>
  api.get(`/movies/${id}`);

export const getShowsByMovie = (movieId) =>
  api.get(`/shows/movie/${movieId}`);

// ---------------------- SHOWS ---------------------- //
export const getShowById = (id) =>
  api.get(`/shows/${id}`);

export const lockSeats = (showId, seatNumbers) =>
  api.post(`/shows/${showId}/lock-seats`, { seat_numbers: seatNumbers });

export const unlockSeats = (showId, seatNumbers) =>
  api.post(`/shows/${showId}/unlock-seats`, { seat_numbers: seatNumbers });

// ---------------------- BOOKINGS ---------------------- //
export const createBooking = (bookingData) =>
  api.post('/bookings', bookingData);

export const getBookings = () =>
  api.get('/bookings');

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

// ---------------------- USERS ---------------------- //
export const updateUser = (userData) =>
  api.put('/users/me', userData);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (email, password) => api.post('/login', { email, password });
export const signup = (userData) => api.post('/signup', userData);
export const getCurrentUser = () => api.get('/users/me');

// Movie endpoints
export const getMovies = () => api.get('/movies');
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const getShowsByMovie = (movieId) => api.get(`/shows/movie/${movieId}`);

// Show endpoints
export const getShowById = (id) => api.get(`/shows/${id}`);
export const lockSeats = (showId, seatNumbers) => 
  api.post(`/shows/${showId}/lock-seats`, { seat_numbers: seatNumbers });
export const unlockSeats = (showId, seatNumbers) => 
  api.post(`/shows/${showId}/unlock-seats`, { seat_numbers: seatNumbers });

// Booking endpoints
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);

// User endpoints
export const updateUser = (userData) => api.put('/users/me', userData);

export default api; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import PaymentPage from './pages/PaymentPage';
import BookingPage from './pages/BookingPage';
import SeatSelection from './pages/SeatSelection';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movies/:id" element={<MovieDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/payment/:bookingId" element={<PaymentPage />} />
                    <Route path="/booking/:showId" element={<BookingPage />} />
                    <Route path="/seat-selection/:movieId/:showId" element={<SeatSelection />} />
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

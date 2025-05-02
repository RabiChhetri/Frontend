import './App.css';
import './CSS/Book.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import Booking from './components/Booking';
import Log from './components/log';
import Bookinglist from './components/Bookinglist';
import Register from './components/Register';
import Adminlog from './components/Adminlog';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Users from './components/Admin/Users';
import Services from './components/Admin/Services';
import Analytics from './components/Admin/Analytics';
import Settings from './components/Admin/Settings';
import Rewards from './components/Admin/Rewards';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import Appointment from './components/Admin/Appointment';

// Wrapper component to handle conditional navbar rendering
const AppContent = () => {
  const location = useLocation();
  // Hide Navbar and Footer for all /admin/* routes except /adminlog
  const isAdminRoute = location.pathname.startsWith('/admin/') && location.pathname !== '/adminlog';

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookinglist" element={<Bookinglist/>} />
        <Route path="/log" element={<Log />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlog" element={<Adminlog />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/appointment" element={<Appointment />} />
        <Route path="/admin/Users" element={<Users />} />
        <Route path="/admin/Services" element={<Services />} />
        <Route path="/admin/Analytics" element={<Analytics />} />
        <Route path="/admin/Settings" element={<Settings />} />
        <Route path="/admin/Rewards" element={<Rewards />} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

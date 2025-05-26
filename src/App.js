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
import Cancellations from './components/Admin/Cancellations';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminAuthWrapper from './components/AdminAuthWrapper';
import Admincontact from './components/Admin/Admincontact';
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

  // Wrap admin routes with AdminAuthWrapper
  const AdminRoute = ({ children }) => {
    return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
  };

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
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/appointment" element={<AdminRoute><Appointment /></AdminRoute>} />
        <Route path="/admin/Users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/admin/Services" element={<AdminRoute><Services /></AdminRoute>} />
        <Route path="/admin/Analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/admin/Settings" element={<AdminRoute><Settings /></AdminRoute>} />
        <Route path="/admin/Rewards" element={<AdminRoute><Rewards /></AdminRoute>} />
        <Route path="/admin/Admincontact" element={<AdminRoute><Admincontact /></AdminRoute>} />
        <Route path="/admin/Cancellations" element={<AdminRoute><Cancellations /></AdminRoute>} />
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

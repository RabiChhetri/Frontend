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
import Footer from './components/Footer';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar should be inside Router but outside Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookinglist" element={<Bookinglist/>} />
        <Route path="/log" element={<Log />} />
        <Route path="/register" element={<Register />} />
  
      </Routes>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

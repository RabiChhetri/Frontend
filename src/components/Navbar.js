import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/">
            <img
              src="/background/final.png"
              alt="Salon Logo"
              className="navbar-logo"
              style={{ height: "55px", width: "auto" }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse mx-2" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} to="/contact">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/booking" ? "active" : ""}`} to="/booking">
                  Book Appointment
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/bookinglist" ? "active" : ""}`} to="/bookinglist">
                  Booking list
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/log" ? "active" : ""}`} to="/log">
                  Log In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

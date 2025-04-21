import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Bookinglist() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/book");
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2>All Bookings</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Service</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.fullName}</td>
              <td>{booking.phoneNumber}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>{booking.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

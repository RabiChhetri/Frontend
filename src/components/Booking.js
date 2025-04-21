// // import React, { useState } from 'react';
// // import '../CSS/Book.css';

// // export default function Booking() {
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     phoneNumber: '',
// //     date: '',
// //     time: '',
// //     service: 'default',
// //   });

// //   const [message, setMessage] = useState('');

// //   const handleChange = (e) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage('');

// //     if (formData.service === 'default') {
// //       const errorMsg = 'Please select a service.';
// //       setMessage(errorMsg);
// //       return;
// //     }

// //     // Format time to HH:MM AM/PM
// //     const time24 = formData.time;
// //     const [hours, minutes] = time24.split(':');
// //     const ampm = hours >= 12 ? 'PM' : 'AM';
// //     const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
// //     const formattedTime = `${hour12}:${minutes} ${ampm}`;

// //     try {
// //       const response = await fetch('http://localhost:5000/api/book', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           fullName: formData.fullName,
// //           phoneNumber: formData.phoneNumber,
// //           date: formData.date,
// //           time: formattedTime,
// //           service: formData.service,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setMessage('Booking successful!');
// //         // Reset form
// //         setFormData({
// //           fullName: '',
// //           phoneNumber: '',
// //           date: '',
// //           time: '',
// //           service: 'default',
// //         });
// //       } else {
// //         // Display the server error message
// //         setMessage(data.message);
// //       }
// //     } catch (err) {
// //       console.error('Booking error:', err);
// //       setMessage('Network error: Please check your connection');
// //     }
// //   };

// //   return (
// //     <div className='booking-container'>
// //       <div className="service-time-section animate-fadeInLeft">
// //         <h3>Service Time</h3>
// //         <ul className="service-time-list">
// //           <li>
// //             <span className="service-name">Hair Cut</span>
// //             <span className="service-duration">30 min</span>
// //           </li>
// //           <li>
// //             <span className="service-name">Hair Cut and Shaving</span>
// //             <span className="service-duration">45 min</span>
// //           </li>
// //           <li>
// //             <span className="service-name">Shaving</span>
// //             <span className="service-duration">15 min</span>
// //           </li>
// //           <li>
// //             <span className="service-name">HairCut and Wash</span>
// //             <span className="service-duration">1 hrs</span>
// //           </li>
// //           <li>
// //             <span className="service-name">Hair Color</span>
// //             <span className="service-duration">1 hrs</span>
// //           </li>
// //         </ul>
// //       </div>

// //       <form onSubmit={handleSubmit} className="booking-form animate-fadeInRight">
// //         <label htmlFor="fullName">Full Name:</label>
// //         <input
// //           type="text"
// //           name="fullName"
// //           id="fullName"
// //           value={formData.fullName}
// //           onChange={handleChange}
// //           placeholder="Enter your Full Name"
// //           required
// //         />
// //         <br />

// //         <label htmlFor="phoneNumber">Phone Number:</label>
// //         <input
// //           type="text"
// //           name="phoneNumber"
// //           id="phoneNumber"
// //           value={formData.phoneNumber}
// //           onChange={handleChange}
// //           placeholder="Enter your Phone Number"
// //           required
// //           maxLength="10"
// //           pattern="[0-9]{10}"
// //           title="Please enter a valid 10-digit phone number"
// //         />
// //         <br />

// //         <label htmlFor="date">Date:</label>
// //         <input
// //           type="date"
// //           name="date"
// //           id="date"
// //           value={formData.date}
// //           onChange={handleChange}
// //           required
// //           min={new Date().toISOString().split('T')[0]}
// //         />
// //         <br />

// //         <label htmlFor="service">Service:</label>
// //         <select
// //           name="service"
// //           id="service"
// //           value={formData.service}
// //           onChange={handleChange}
// //           required
// //         >
// //           <option value="default">Choose Our Services</option>
// //           <option value="haircut">HairCut (Rs.200)</option>
// //           <option value="shaving">Shaving (Rs.150)</option>
// //           <option value="haircut_shaving">HairCut and Shaving (Rs.250)</option>
// //           <option value="hair_color">Hair Color (Rs.500)</option>
// //           <option value="haircut_wash">HairCut and Wash (Rs.350)</option>
// //         </select>
// //         <br />

// //         <label htmlFor="time">Time:</label>
// //         <input
// //           type="time"
// //           name="time"
// //           id="time"
// //           value={formData.time}
// //           onChange={handleChange}
// //           required
// //           min="08:00"
// //           max="20:00"
// //         />
// //         <br />

// //         <button type="submit">Send</button>
// //       </form>

// //       {message && (
// //         <div className="alert-overlay">
// //           <div className={`alert-popup ${message.includes('successful') ? 'success' : 'error'}`}>
// //             <div className="alert-icon">
// //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                 {message.includes('successful') ? (
// //                   <path d="M20 6L9 17l-5-5" />
// //                 ) : (
// //                   <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                 )}
// //               </svg>
// //             </div>
// //             <h3>{message.includes('successful') ? 'Success!' : 'Error!'}</h3>
// //             <p>{message}</p>
// //             <button onClick={() => setMessage('')}>OK</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState } from 'react';
// import '../CSS/Book.css';

// export default function Booking() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     date: '',
//     time: '',
//     service: 'default',
//   });

//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     if (formData.service === 'default') {
//       setMessage('Please select a service.');
//       return;
//     }

//     // Format time to HH:MM AM/PM
//     const [hours, minutes] = formData.time.split(':');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
//     const formattedTime = `${hour12}:${minutes} ${ampm}`;

//     try {
//       const response = await fetch('http://localhost:5000/api/book', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           phoneNumber: formData.phoneNumber,
//           date: formData.date,
//           time: formattedTime,
//           service: formData.service,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Booking successful!');
//         setFormData({
//           fullName: '',
//           phoneNumber: '',
//           date: '',
//           time: '',
//           service: 'default',
//         });
//       } else {
//         // Handle specific duplicate phone number error
//         if (data.message && data.message.toLowerCase().includes('phone number already exists')) {
//           setMessage('Number already exists, use another number to book the appointment.');
//         } else {
//           setMessage(data.message || 'Something went wrong.');
//         }
//       }
//     } catch (err) {
//       console.error('Booking error:', err);
//       setMessage('Network error: Please check your connection');
//     }
//   };

//   return (
//     <div className='booking-container'>
//       <div className="service-time-section animate-fadeInLeft">
//         <h3>Service Time</h3>
//         <ul className="service-time-list">
//           <li><span className="service-name">Hair Cut</span><span className="service-duration">30 min</span></li>
//           <li><span className="service-name">Hair Cut and Shaving</span><span className="service-duration">45 min</span></li>
//           <li><span className="service-name">Shaving</span><span className="service-duration">15 min</span></li>
//           <li><span className="service-name">HairCut and Wash</span><span className="service-duration">1 hrs</span></li>
//           <li><span className="service-name">Hair Color</span><span className="service-duration">1 hrs</span></li>
//         </ul>
//       </div>

//       <form onSubmit={handleSubmit} className="booking-form animate-fadeInRight">
//         <label htmlFor="fullName">Full Name:</label>
//         <input
//           type="text"
//           name="fullName"
//           id="fullName"
//           value={formData.fullName}
//           onChange={handleChange}
//           placeholder="Enter your Full Name"
//           required
//         />
//         <br />

//         <label htmlFor="phoneNumber">Phone Number:</label>
//         <input
//           type="text"
//           name="phoneNumber"
//           id="phoneNumber"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           placeholder="Enter your Phone Number"
//           required
//           maxLength="10"
//           pattern="[0-9]{10}"
//           title="Please enter a valid 10-digit phone number"
//         />
//         <br />

//         <label htmlFor="date">Date:</label>
//         <input
//           type="date"
//           name="date"
//           id="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//           min={new Date().toISOString().split('T')[0]}
//         />
//         <br />

//         <label htmlFor="service">Service:</label>
//         <select
//           name="service"
//           id="service"
//           value={formData.service}
//           onChange={handleChange}
//           required
//         >
//           <option value="default">Choose Our Services</option>
//           <option value="haircut">HairCut (Rs.200)</option>
//           <option value="shaving">Shaving (Rs.150)</option>
//           <option value="haircut_shaving">HairCut and Shaving (Rs.250)</option>
//           <option value="hair_color">Hair Color (Rs.500)</option>
//           <option value="haircut_wash">HairCut and Wash (Rs.350)</option>
//         </select>
//         <br />

//         <label htmlFor="time">Time:</label>
//         <input
//           type="time"
//           name="time"
//           id="time"
//           value={formData.time}
//           onChange={handleChange}
//           required
//           min="08:00"
//           max="20:00"
//         />
//         <br />

//         <button type="submit">Send</button>
//       </form>

//       {message && (
//         <div className="alert-overlay">
//           <div className={`alert-popup ${message.includes('successful') ? 'success' : 'error'}`}>
//             <div className="alert-icon">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 {message.includes('successful') ? (
//                   <path d="M20 6L9 17l-5-5" />
//                 ) : (
//                   <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 )}
//               </svg>
//             </div>
//             <h3>{message.includes('successful') ? 'Success!' : 'Error!'}</h3>
//             <p>{message}</p>
//             <button onClick={() => setMessage('')}>OK</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from 'react';
import '../CSS/Book.css';

export default function Booking() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    date: '',
    time: '',
    service: 'default',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.service === 'default') {
      setMessage('Please select a service.');
      return;
    }

    // Format time to HH:MM AM/PM
    const time24 = formData.time;
    const [hours, minutes] = time24.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          date: formData.date,
          time: formattedTime,
          service: formData.service,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking successful!');
        setFormData({
          fullName: '',
          phoneNumber: '',
          date: '',
          time: '',
          service: 'default',
        });
      } else {
        if (data.error === 'PHONE_ALREADY_EXISTS') {
          setMessage('This phone number is already used for a booking. Please use another number.');
        } else {
          setMessage(data.message);
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setMessage('Network error: Please check your connection');
    }
  };

  return (
    <div className='booking-container'>
      <div className="service-time-section animate-fadeInLeft">
        <h3>Service Time</h3>
        <ul className="service-time-list">
          <li><span className="service-name">Hair Cut</span><span className="service-duration">30 min</span></li>
          <li><span className="service-name">Hair Cut and Shaving</span><span className="service-duration">45 min</span></li>
          <li><span className="service-name">Shaving</span><span className="service-duration">15 min</span></li>
          <li><span className="service-name">HairCut and Wash</span><span className="service-duration">1 hrs</span></li>
          <li><span className="service-name">Hair Color</span><span className="service-duration">1 hrs</span></li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="booking-form animate-fadeInRight">
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your Full Name"
          required
        /><br />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your Phone Number"
          required
          maxLength="10"
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit phone number"
        /><br />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
        /><br />

        <label htmlFor="service">Service:</label>
        <select
          name="service"
          id="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="default">Choose Our Services</option>
          <option value="haircut">HairCut (Rs.200)</option>
          <option value="shaving">Shaving (Rs.150)</option>
          <option value="haircut_shaving">HairCut and Shaving (Rs.250)</option>
          <option value="hair_color">Hair Color (Rs.500)</option>
          <option value="haircut_wash">HairCut and Wash (Rs.350)</option>
        </select><br />

        <label htmlFor="time">Time:</label>
        <input
          type="time"
          name="time"
          id="time"
          value={formData.time}
          onChange={handleChange}
          required
          min="08:00"
          max="20:00"
        /><br />

        <button type="submit">Send</button>
      </form>

      {message && (
        <div className="alert-overlay">
          <div className={`alert-popup ${message.includes('successful') ? 'success' : 'error'}`}>
            <div className="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {message.includes('successful') ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <h3>{message.includes('successful') ? 'Success!' : 'Error!'}</h3>
            <p>{message}</p>
            <button onClick={() => setMessage('')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

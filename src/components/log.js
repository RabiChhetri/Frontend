import React from 'react';
import { Link } from 'react-router-dom';

export default function Log() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>
        <div className="input-group">
          <label>Email</label>
          <input type="text" placeholder="Enter your email"/>
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button className="login-btn">Log In</button>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// export default function Log() {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login-auth', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           email: credentials.email,
//           password: credentials.password
//         })
//       });

//       const json = await response.json();
//       if (response.ok) {
//         // Save the auth token and user data
//         localStorage.setItem('token', json.authToken);
//         localStorage.setItem('userData', JSON.stringify(json.user));
//         setUserData(json.user);
//         alert(`Login Successful! Welcome ${json.user.name}`);
//         navigate('/'); // Navigate to home page or dashboard
//       } else {
//         alert(json.error || 'Invalid credentials');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while logging in');
//     }
//   };

//   const onChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="login-container">
//       {userData ? (
//         <div className="user-info">
//           <h3>Welcome, {userData.name}!</h3>
//           <p>Email: {userData.email}</p>
//         </div>
//       ) : (
//         <div className="login-form">
//           <h2>Log In</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Email</label>
//               <input 
//                 type="email" 
//                 name="email"
//                 value={credentials.email}
//                 onChange={onChange}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label>Password</label>
//               <input 
//                 type="password"
//                 name="password"
//                 value={credentials.password}
//                 onChange={onChange}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//             <button type="submit" className="login-btn">Log In</button>
//           </form>
//           <p className="register-link">
//             Don't have an account? <Link to="/register">Register</Link>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
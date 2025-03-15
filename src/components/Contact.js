// import React from 'react';

// export default function Contact() {
//   return (
//     <div style={{ width: "100%" }}>
//       <iframe
//         width="100%"
//         height="400"
//         scrolling="no"
//         style={{ border: "0" }}
//         src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=Astar%20Unisex%20Salon,%206X9G+MRW,%20Pokhara%2033700+(Astar%20Unisex%20Salon)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
//         title="Google Maps"
//       ></iframe>

      
//         <form action="" method="POST" className="Contact">
//           <label htmlFor="fname">Full Name:</label><br />
//           <input type="text" id="fname" name="fname" placeholder="Full Name" required /><br />

//           <label htmlFor="lname">Email:</label><br />
//           <input type="email" id="lname" name="lname" placeholder="Email" required /><br /><br />

//           <label htmlFor="message">Message:</label><br />
//           <textarea name="message" id="message" placeholder="Write a message" required></textarea><br />

//           <input type="submit" value="Submit" />
//         </form>
//       </div>
//   );
// }
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setAlertMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        setAlertMessage("Failed to send message. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <iframe
        width="100%"
        height="400"
        scrolling="no"
        style={{ border: "0" }}
        src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=Astar%20Unisex%20Salon,%206X9G+MRW,%20Pokhara%2033700+(Astar%20Unisex%20Salon)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        title="Google Maps"
      ></iframe>

      <form onSubmit={handleSubmit} className="Contact">
        <label htmlFor="name">Full Name:</label><br />
        <input type="text" id="name" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br /><br />

        <label htmlFor="message">Message:</label><br />
        <textarea name="message" id="message" placeholder="Write a message" value={formData.message} onChange={handleChange} required></textarea><br />

        <input type="submit" value="Submit" />
      </form>

      {alertMessage && <p>{alertMessage}</p>}
    </div>
  );
}

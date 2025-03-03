import React from 'react';

export default function Contact() {
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

      
        <form action="" method="POST" className="Contact">
          <label htmlFor="fname">Full Name:</label><br />
          <input type="text" id="fname" name="fname" placeholder="Full Name" required /><br />

          <label htmlFor="lname">Email:</label><br />
          <input type="email" id="lname" name="lname" placeholder="Email" required /><br /><br />

          <label htmlFor="message">Message:</label><br />
          <textarea name="message" id="message" placeholder="Write a message" required></textarea><br />

          <input type="submit" value="Submit" />
        </form>
      </div>
  );
}

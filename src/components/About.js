import React from "react";
import "../CSS/about.css";
const services = [
  {
    category: 'Hair Styling',
    items: [
      { name: 'Hair Cut', price: 'Rs200' },
      { name: 'Hair Styling', price: 'Rs250' },
      { name: 'Hair Coloring', price: 'Rs500' },
    ],
  },
  {
    category: 'Shaving',
    items: [
      { name: 'Clean Shaving', price: 'Rs150' },
      { name: 'Beard Triming', price: 'Rs100' },
      { name: 'Smooth Shave', price: 'Rs200' },
    ],
  },
  {
    category: 'Face Masking',
    items: [
      { name: 'White Facial', price: 'Rs300' },
      { name: 'Face Cleaning', price: 'Rs250' },
      { name: 'Bright Tuning', price: 'Rs350' },
    ],
  },
];

function About() {
  return (
    <>
    <div>
      <div className="about-container">
        <div className="about-content">
          <h1>About Us</h1>
          <p>
            {" "}
            Welcome to <strong>Astar Unisex Salon</strong>, where tradition
            meets modern style. More than just a place for a haircut, we offer a
            space where craftsmanship, style, and personal care come together in
            a relaxed, welcoming atmosphere.{" "}
          </p>{" "}
          <p>
            {" "}
            From precision cuts and classic shaves to sharp fades and fresh
            beard trims, our skilled barbers blend timeless techniques with
            modern trends to help you look and feel your best. Step in, sit
            back, and enjoy the art of grooming.{" "}
          </p>
          <button className="about-btn">Learn More</button>
        </div>
        <div className="about-image">
          <img src="/background/barberimg.jpg" alt="About Us" style={{height:'400px',width:'auto'}}/>
        </div>
      </div>
    </div>
    <div className="pricing-table">
      <div className="header">
        <h1>Our Barber Pricing</h1>
        <div className="separator"></div>
      </div>
      <div className="columns">
        {services.map((category) => (
          <div key={category.category} className="column">
            <h3>{category.category}</h3>
            {category.items.map((item) => (
              <div key={item.name} className="service">
                <div className="service-header">
                  <span className="service-name">{item.name}</span>
                  <span className="service-price">{item.price}</span>
                </div>
                <p className="service-description">
                  Barber is a person whose occupation is mainly to cut dress groom style and shave men.
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default About;

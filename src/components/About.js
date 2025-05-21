import React from "react";
import "../CSS/about.css";
const services = [
  {
    category: 'Hair Styling',
    items: [
      { 
        name: 'Hair Cut', 
        price: 'Rs200',
        description: 'Sharp, stylish haircuts tailored to your look by expert professionals today.'
      },
      { 
        name: 'Hair Styling', 
        price: 'Rs250',
        description: 'Trendy, personalized hair styling that enhances confidence and showcases your personality.'
      },
      { 
        name: 'Hair Coloring', 
        price: 'Rs500',
        description: 'Vibrant hair coloring with rich tones to match your style and attitude.'
      },
    ],
  },
  {
    category: 'Shaving',
    items: [
      { 
        name: 'Clean Shaving', 
        price: 'Rs150',
        description: 'Experience a smooth, clean shave with precision, comfort, and expert care.'
      },
      { 
        name: 'Beard Triming', 
        price: 'Rs100',
        description: 'Perfectly sculpted beard trims for a clean, sharp, and confident appearance.'
      },
      { 
        name: 'Smooth Shave', 
        price: 'Rs200',
        description: 'Luxuriously smooth shave using premium products for a fresh, refined finish.'
      },
    ],
  },
  {
    category: 'Face Masking',
    items: [
      { 
        name: 'White Facial', 
        price: 'Rs300',
        description: 'Revitalize your skin with our glow-boosting, deep-cleansing white facial treatment.'
      },
      { 
        name: 'Face Cleaning', 
        price: 'Rs250',
        description: 'Deep face cleaning that clears pores, refreshes skin, and restores your glow.'
      },
      { 
        name: 'Bright Tuning', 
        price: 'Rs350',
        description: 'Bright tuning facial to even skin tone, boost radiance, and refresh instantly.'
      },
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
                {item.description}
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

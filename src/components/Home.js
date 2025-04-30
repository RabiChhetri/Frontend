import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faScissors,faRulerHorizontal,faBrush,faShower} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleAppointmentClick = () => {
    if (isLoggedIn) {
      navigate('/booking');
    } else {
      navigate('/log');
    }
  };

  return (
    <>

      {/* Carousel */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/background/slide-1.jpg"
              className="d-block w-100"
              alt="..."
              style={{ height: "500px", objectFit: "cover" }}
            />
            {/* <div className="carousel-caption d-none d-md-block text-start start-0 ps-5" stlye={{}}> */}
            <div
              className="carousel-caption text-start animate-fadeInUp"
              style={{ top: "50px", left: "20%" }}
            >
              <div className="slider_content">
                <h3>Its Not Just a Haircut, Its an Experience.</h3>
                <h1>
                  Being a barber is about <br />
                  taking care of the people.
                </h1>
                <p>
                  Our barbershop is the territory created purely for males who
                  appreciate
                  <br /> premium quality, time and flawless look.
                </p>
                <button
                  onClick={handleAppointmentClick}
                  className="btn btn-md btn-map animate-zoomIn"
                >
                  Make Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/background/slide-2.jpg"
              className="d-block w-100"
              alt="..."
              style={{ height: "500px", objectFit: "cover" }}
            />
            {/* <div className="carousel-caption d-none d-md-block text-start start-0 ps-5 "> */}
            <div
              className="carousel-caption text-start animate-fadeInUp"
              style={{ top: "50px", left: "20%" }}
            >
              <div className="slider_content">
                <h3>Classic Hair Style & Shaves.</h3>
                <h1>
                  Our hair styles
                  <br />
                  enhances your smile.
                </h1>
                <p>
                  Our barbershop is the territory created purely for males who
                  appreciate
                  <br /> premium quality, time and flawless look.
                </p>
                {/* <button type="button" className="btn btn-map" href="logo.com"></button> */}
                <button
                  onClick={handleAppointmentClick}
                  className="btn btn-md btn-map animate-zoomIn"
                >
                  Make Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/background/slide-3.jpg"
              className="d-block w-100"
              alt="..."
              style={{ height: "500px", objectFit: "cover" }}
            />
            {/* <div className="carousel-caption d-none d-md-block text-start start-0 ps-5"> */}
            <div
              className="carousel-caption text-start animate-fadeInUp"
              style={{ top: "50px", left: "20%" }}
            >
              <div className="slider_content">
                <h3>Its Not Just a Haircut, Its an Experience.</h3>
                <h1>
                  Where mens want <br />
                  to look there very best.
                </h1>
                <p>
                  Our barbershop is the territory created purely for males who
                  appreciate
                  <br /> premium quality, time and flawless look.
                </p>
                <button
                  onClick={handleAppointmentClick}
                  className="btn btn-md btn-map animate-zoomIn"
                >
                  Make Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
          style={{ left: "5%" }}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
          style={{ right: "5%" }}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* About Us */}
      <section id="about" className="about_section bd-bottom padding my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="about_content">
                <h3 className="Introducing animate-fadeInLeft">Introducing</h3>
                <h2 className="Astar animate-fadeInLeft">
                  Astar Unisex Salon
                  <br />
                  Since 2022
                </h2>
                <img
                  className="bl animate-zoomIn"
                  src="/background/about-logo.png"
                  alt="logo"
                  style={{
                    height: "200px",
                    width: "auto",
                    display: "block",
                    margin: "0 auto 20px ",
                  }}
                />
                <p className="animate-fadeInLeft">
                  Barber is a person whose occupation is mainly to cut dress
                  groom style and shave men's and boys' hair. A barber's place
                  of work is known as a "barbershop" or a "barber's".
                  Barbershops are also places of social interaction and public
                  discourse. In some instances, barbershops are also public
                  forums.
                </p>
                <a
                  href="/"
                  className="btn btn-md btn-map betn-about animate-zoomIn"
                  style={{
                    display: "block",
                    textAlign: "center",
                    margin: "0 auto 10px",
                    width: "fit-content",
                  }}
                >
                  More About Us
                </a>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <div className="about_img">
                <img src="background/barberimg.jpg" alt="idea-images" className="about_img_1 animate-fadeInRight" />
                <img src="background/about-2.jpg" alt="idea-images" className="about_img_2 animate-fadeInRight" />
                <img src="background/about-3.jpg" alt="idea-images" className="about_img_3 animate-fadeInRight" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service */}
      {/* <section className="service_section bg-grey padding">
        <div className="container">
            <div className="section_heading text-center mb-40 wow fadeInUp" data-wow-delay="300ms">
                <h2>Our Services</h2>
                <div className="heading-line"></div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 sm-padding wow fadeInUp" data-wow-delay="200ms">
                    <div className="service_box">
                        <FontAwesomeIcon className="icon" icon={faScissors} />
                        <h3>Haircut Styles</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding wow fadeInUp" data-wow-delay="300ms">
                    <div className="service_box">
                        <FontAwesomeIcon className="icon" icon={faRulerHorizontal} />
                        <h3>Beard Triming</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding wow fadeInUp" data-wow-delay="400ms">
                    <div className="service_box">
                        <FontAwesomeIcon className="icon" icon={faShower} />
                        <h3>Hair Wash</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding wow fadeInUp" data-wow-delay="500ms">
                    <div className="service_box">
                        <FontAwesomeIcon className="icon" icon={faBrush} />
                        <h3>Hair Coloring</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
            </div>
        </div>
    </section> */}

    <section className="service_section padding">
        <div className="container">
            <div className="section_heading text-center mb-40 animate-fadeInDown">
                <h2>Our Services</h2>
                <div className="heading-line"></div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 sm-padding">
                    <div className="service_box animate-zoomIn">
                        <FontAwesomeIcon className="icon" icon={faScissors} />
                        <h3>Haircut Styles</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding">
                    <div className="service_box animate-zoomIn">
                        <FontAwesomeIcon className="icon" icon={faRulerHorizontal} />
                        <h3>Beard Triming</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding">
                    <div className="service_box animate-zoomIn">
                        <FontAwesomeIcon className="icon" icon={faShower} />
                        <h3>Hair Wash</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 sm-padding">
                    <div className="service_box animate-zoomIn">
                        <FontAwesomeIcon className="icon" icon={faBrush} />
                        <h3>Hair Coloring</h3>
                        <p>Barber is a person whose occupation is mainly to cut dress style.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    {/* Contact Us */}

    {/* Footer */}
    </>
  );
}

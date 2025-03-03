import React from "react";

export default function footer() {
  return (
    <div>
      <div class="container">
        <footer class="row row-cols-1 row-cols-sm-2 row-cols-md-5 pt-5 pb-1 my-5 border-top">
          <div class="col mb-3">
            <a
              href="/"
              class="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none"
            >
              <img
                src="/background/final.png"
                alt="Salon Logo"
                className="footer-logo"
              />
            </a>
            <p className="text-body-secondary">
              &copy; {new Date().getFullYear()} Astar Unisex Salon
            </p>
          </div>

          <div class="col mb-3"> </div>

          <div class="col mb-3">
            <h5>Headquater</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">
                  Malepatan-0km,Pokhara
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">
                  Address: 6X9G+MRW, Pokhara 33700
                </a>
              </li>
            </ul>
          </div>
          <div class="col mb-3">
            <h5>Opening Hours</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Sun-Fri: 7am-8pm</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Sat: 10am-5pm</a>
              </li>
            </ul>
          </div>
          <div class="col mb-3">
            <h5>Contact</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">
                  astarunisexsalon@gmail.com
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">+977 9816693492</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

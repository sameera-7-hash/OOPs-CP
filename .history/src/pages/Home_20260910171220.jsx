import React from "react";

function Home({ onLogin }) {
  return (
    <div className="home-page">

      <header className="home-header">

        <div className="home-brand">

          <div className="home-logo">
            ✚
          </div>

          <div>
            <h2>PatientCare</h2>
            <p>Secure Healthcare Management</p>
          </div>

        </div>

        <nav className="home-nav">

          <button>
            About Us
          </button>

          <button>
            Help
          </button>

          <button>
            Contact
          </button>

          <button
            className="home-login-btn"
            onClick={onLogin}
          >
            Login
          </button>

        </nav>

      </header>


      <main className="home-main">

        <section className="home-content">

          <div className="home-text">

            <div className="home-badge">
              🔒 Secure Healthcare Platform
            </div>

            <h1>
              Welcome To <span>PatientCare</span>
            </h1>

            <h2>
              Your Health, Your Priority
            </h2>

            <p>
              A secure and reliable healthcare management platform
              designed to connect patients, doctors and nurses in one
              place.
            </p>

            <div className="home-buttons">

              <button
                className="primary-home-btn"
                onClick={onLogin}
              >
                Login to PatientCare →
              </button>

              <button className="secondary-home-btn">
                Learn More
              </button>

            </div>

          </div>


          <div className="home-illustration">

            <div className="illustration-circle">
              👩‍⚕️
            </div>

            <div className="floating-card card-one">

              🔐

              <div>
                <strong>Secure</strong>
                <small>Your data is protected</small>
              </div>

            </div>


            <div className="floating-card card-two">

              🛡️

              <div>
                <strong>Encrypted</strong>
                <small>Protected health records</small>
              </div>

            </div>


            <div className="floating-card card-three">

              ✓

              <div>
                <strong>Trusted</strong>
                <small>Reliable healthcare</small>
              </div>

            </div>

          </div>

        </section>


        <section className="home-security">

          <div className="home-security-item">

            <span>🔐</span>

            <div>
              <strong>Secure</strong>
              <p>Your information is protected</p>
            </div>

          </div>


          <div className="home-security-item">

            <span>🛡️</span>

            <div>
              <strong>Encrypted</strong>
              <p>Healthcare data stays protected</p>
            </div>

          </div>


          <div className="home-security-item">

            <span>✓</span>

            <div>
              <strong>Trusted</strong>
              <p>Designed for secure healthcare</p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;
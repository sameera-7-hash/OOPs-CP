import React, { useState } from "react";

function Home({ onLogin }) {
  const [activeInfo, setActiveInfo] = useState(null);

  const openInfo = (type) => {
    setActiveInfo(type);
  };

  const closeInfo = () => {
    setActiveInfo(null);
  };

  return (
    <div className="home-page">

      <header className="home-header">

        <div className="home-brand">
          <div className="home-logo">✚</div>

          <div>
            <h2>PatientCare</h2>
            <p>Secure Healthcare Management</p>
          </div>
        </div>

        <nav className="home-nav">

          <button onClick={() => openInfo("about")}>
            About Us
          </button>

          <button onClick={() => openInfo("help")}>
            Help
          </button>

          <button onClick={() => openInfo("contact")}>
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

            <h2>Your Health, Your Priority</h2>

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

              <button
                className="secondary-home-btn"
                onClick={() => openInfo("about")}
              >
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


      {activeInfo && (
        <div
          className="info-overlay"
          onClick={closeInfo}
        >

          <div
            className="info-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="info-close"
              onClick={closeInfo}
            >
              ×
            </button>

            {activeInfo === "about" && (
              <div>
                <div className="info-icon">🏥</div>

                <h2>About PatientCare</h2>

                <p>
                  PatientCare is a secure healthcare management
                  platform designed to connect patients, doctors
                  and nurses in one place.
                </p>

                <p>
                  Patients can manage appointments, prescriptions,
                  medical records and health history while doctors
                  and nurses can manage patient care efficiently.
                </p>
              </div>
            )}


            {activeInfo === "help" && (
              <div>
                <div className="info-icon">❓</div>

                <h2>Help & Support</h2>

                <p>
                  Need help using PatientCare?
                </p>

                <div className="help-list">
                  <p>🔹 Select your role to continue.</p>
                  <p>🔹 Login using your account credentials.</p>
                  <p>🔹 Use the dashboard menu to access services.</p>
                  <p>🔹 Contact support if you face any issue.</p>
                </div>
              </div>
            )}


            {activeInfo === "contact" && (
              <div>
                <div className="info-icon">📞</div>

                <h2>Contact Us</h2>

                <p>
                  Our support team is available to assist you.
                </p>

                <div className="contact-details">
                  <p>📧 Email: support@patientcare.com</p>
                  <p>📞 Phone: +91 98765 43210</p>
                  <p>📍 Location: Pune, Maharashtra</p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Home;
import React from "react";

function Navbar({ onHome }) {
  return (
    <nav className="navbar">
      <div className="brand" onClick={onHome}>
        <div className="brand-icon">✚</div>

        <div>
          <div className="brand-name">PatientCare</div>
          <div className="brand-subtitle">
            Secure Healthcare Management
          </div>
        </div>
      </div>

      <div className="nav-links">
        <button onClick={onHome}>About Us</button>
        <button onClick={onHome}>How It Works</button>
        <button onClick={onHome}>Help</button>
        <button onClick={onHome}>Contact</button>
      </div>
    </nav>
  );
}

export default Navbar;
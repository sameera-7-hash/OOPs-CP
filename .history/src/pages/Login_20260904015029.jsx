import React, { useState } from "react";

function Login({ role, onLogin, onBack }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert("Please enter User ID and Password.");
      return;
    }

    onLogin();
  };

  return (
    <div className="login-page">

      <div className="login-header">
        <button onClick={onBack}>← Back</button>

        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <div className="brand-name">PatientCare</div>
            <div className="brand-subtitle">
              Secure Healthcare Management
            </div>
          </div>
        </div>
      </div>

      <div className="login-container">

        <div className="login-box">

          <div className="login-role-icon">
            {role === "Patient" && "👤"}
            {role === "Doctor" && "⚕"}
            {role === "Nurse" && "✚"}
          </div>

          <h1>{role} Login</h1>

          <p>
            Welcome back! Please login to your account.
          </p>

          <form onSubmit={submitLogin}>

            <label>User ID / Email</label>

            <input
              type="text"
              placeholder="Enter your user ID or email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button">
                Forgot Password?
              </button>
            </div>

            <button className="login-button" type="submit">
              Login
            </button>

          </form>

        </div>

        <div className="login-info">

          <div className="large-medical-icon">⚕</div>

          <h2>Secure Healthcare</h2>

          <p>
            Your healthcare information is protected
            with secure and encrypted storage.
          </p>

          <div className="login-security">

            <span>🔒 Secure</span>
            <span>▣ Encrypted</span>
            <span>✓ Trusted</span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
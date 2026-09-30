import React, { useState } from "react";

function Login({ role, onLogin, onBack }) {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);


  const handleSubmit = (e) => {

    e.preventDefault();

    if (!userId || !password) {

      alert(
        "Please enter your User ID and Password."
      );

      return;
    }

    onLogin();
  };


  const getRoleIcon = () => {

    if (role === "Patient") return "👤";

    if (role === "Doctor") return "⚕";

    return "✚";
  };


  const getDescription = () => {

    if (role === "Patient") {

      return "Access your health records, appointments and prescriptions.";
    }

    if (role === "Doctor") {

      return "Manage patients, consultations, prescriptions and reports.";
    }

    return "Manage patient care, tasks, appointments and alerts.";
  };


  return (

    <div className="login-page">


      <div className="login-left">

        <div className="login-top">

          <div className="login-brand">

            <div className="login-logo">
              ✚
            </div>

            <div>
              <h2>PatientCare</h2>
              <p>Secure Healthcare Management</p>
            </div>

          </div>


          <button
            className="login-back-button"
            onClick={onBack}
          >
            ← Back to Home
          </button>

        </div>


        <div className="login-form-container">

          <div className="role-login-icon">
            {getRoleIcon()}
          </div>


          <h1>
            {role} Login
          </h1>


          <p className="login-welcome">
            Welcome back! Please login to your account.
          </p>


          <p className="login-description">
            {getDescription()}
          </p>


          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>
                User ID / Email
              </label>

              <div className="input-wrapper">

                <span>
                  👤
                </span>

                <input
                  type="text"
                  placeholder={
                    role === "Patient"
                      ? "Enter your patient ID or email"
                      : role === "Doctor"
                      ? "Enter your doctor ID or email"
                      : "Enter your nurse ID or email"
                  }
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            <div className="login-options">

              <label className="remember-option">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                Remember me

              </label>


              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert(
                    "Password recovery will be added later."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>


            <button
              type="submit"
              className="main-login-button"
            >
              Login as {role} →
            </button>

          </form>


          <div className="login-security">

            <div>
              🔐

              <span>
                <strong>Secure</strong>
                Protected login
              </span>

            </div>


            <div>
              🛡

              <span>
                <strong>Encrypted</strong>
                Data protection
              </span>

            </div>


            <div>
              ✓

              <span>
                <strong>Trusted</strong>
                Secure access
              </span>

            </div>

          </div>

        </div>

      </div>


      <div className="login-right">

        <div className="login-illustration">

          <div className="doctor-circle">

            {role === "Patient"
              ? "🧑‍💻"
              : "👩‍⚕️"}

          </div>


          <div className="login-floating-card secure-card">

            🔐

            <div>
              <strong>Secure</strong>
              <small>Your account is protected</small>
            </div>

          </div>


          <div className="login-floating-card encrypted-card">

            🛡️

            <div>
              <strong>Encrypted</strong>
              <small>Your health data is protected</small>
            </div>

          </div>


          <div className="login-floating-card trusted-card">

            ✓

            <div>
              <strong>Trusted</strong>
              <small>Reliable healthcare platform</small>
            </div>

          </div>

        </div>


        <div className="login-right-text">

          <h2>
            Your Health.
            <br />
            Our Priority.
          </h2>

          <p>
            PatientCare provides secure access to your
            healthcare information anytime, anywhere.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
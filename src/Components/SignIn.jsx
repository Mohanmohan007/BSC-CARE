import React, { useState, useEffect } from "react";
import "./SignIn.css";
import { Heart, Activity, TrendingUp } from "lucide-react";
import HeartRate from ".././assets/HeartRate.jpg";
import Lungs from ".././assets/Lungs.jpg";
import Vital from ".././assets/Vital.jpg";
const CREDENTIALS_KEY = "vitalcare-credentials";

export default function SignIn({ onLogin = () => {}, onNavigate }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const medicalImages = [
    {
      title: "Heart Rate Monitor",
      subtitle: "Real-time cardiac monitoring",
      gradient: "linear-gradient(135deg, #ff6b6b, #ff8e8e)",
      bgImage: HeartRate,
    },
    {
      title: "Respiratory Tracker",
      subtitle: "Advanced breathing analysis",
      gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
      bgImage: Lungs,
    },
    {
      title: "Vital Dashboard",
      subtitle: "Complete health overview",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      bgImage: Vital,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % medicalImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleBackClick = () => {
    setIsLoginVisible(false);
    setIsSignUp(false);
  };

  const saveCredentials = (email, password, name) => {
    const payload = { email, password, fullName: name };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(payload));
  };

  const getSavedCredentials = () => {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = getSavedCredentials();
    if (!saved) {
      alert("No account exists. Please sign up first.");
      return;
    }
    if (email.trim() === saved.email && password === saved.password) {
      onLogin({ email: saved.email, fullName: saved.fullName });
    } else {
      alert("Email or password is incorrect.");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      alert("Please fill all signup fields.");
      return;
    }
    saveCredentials(email.trim(), password, fullName.trim());
    setIsSignUp(true);
  };

  return (
    <div className="app-container">
      {/* Left Side - Sliding Images */}
      <div className="left-panel">
        <div className="medical-background">
          <div className="heartbeat-line"></div>
          <div className="pulse-circles">
            <div className="pulse-circle pulse-1"></div>
            <div className="pulse-circle pulse-2"></div>
            <div className="pulse-circle pulse-3"></div>
          </div>
        </div>

        <div className="sliding-content">
          {medicalImages.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentImageIndex ? "active" : ""}`}
              style={{ background: image.gradient }}
            >
              <div className="slide-content-wrapper">
                <div className="slide-content">
                  <div
                    className="slide-bg-image"
                    style={{ backgroundImage: `url(${image.bgImage})` }}
                  ></div>
                  <div className="medical-icon">
                    {index === 0 && (
                      <div className="icon heart-icon" aria-label="heart">
                        <Heart strokeWidth={1.5} size={44} />
                      </div>
                    )}
                    {index === 1 && (
                      <div className="icon lungs-icon" aria-label="lungs">
                        {/* lucide doesn't have a lungs icon by default; using Activity to suggest breath/respiration */}
                        <Activity strokeWidth={1.5} size={44} />
                      </div>
                    )}
                    {index === 2 && (
                      <div className="icon chart-icon" aria-label="chart">
                        <TrendingUp strokeWidth={1.5} size={44} />
                      </div>
                    )}
                  </div>
                  <h2>{image.title}</h2>
                  <p>{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="slide-indicators">
          {medicalImages.map((_, index) => (
            <div
              key={index}
              className={`indicator ${
                index === currentImageIndex ? "active" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Side - iOS Style Form */}
      <div className="right-panel">
        <div className="form-container"
        >
          <div className="form-header">
            <h1
              className="main-title logo-heading"
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="logo-icon" aria-hidden="true">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="VitalCare logo"
                >
                  <defs>
                    <linearGradient
                      id="vc-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="30" fill="url(#vc-grad)" />
                  <path
                    d="M32 20c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                    fill="#fff"
                  />
                  <path
                    d="M44 30h-6v-6c0-1.104-.896-2-2-2h-4c-1.104 0-2 .896-2 2v6h-6c-1.104 0-2 .896-2 2v4c0 1.104.896 2 2 2h6v6c0 1.104.896 2 2 2h4c1.104 0 2-.896 2-2v-6h6c1.104 0 2-.896 2-2v-4c0-1.104-.896-2-2-2z"
                    fill="#fff"
                  />
                </svg>
              </span>
              <span style={{ marginBottom: "8px" }}>BCS Care</span>
            </h1>{" "}
            <p>Monitor your health with precision</p>
          </div>

          <div
            className={`signup-container ${isLoginVisible ? "slide-up" : ""}`}
          >
            <div className="form-header">
              <h1 className="main-title">Sign up</h1>
              <div className="arrow-down">↓</div>
            </div>

            <div className="form-content">
              {!isSignUp && (
                <>
                  <div className="input-group">
                    <div className="input-wrapper">
                      <span className="input-icon">
                        {/* user icon SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="fullName"
                        className="modern-input has-label"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder=" "
                      />
                      <label htmlFor="fullName" className="floating-label">
                        User name
                      </label>
                      <div className="input-glow"></div>
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <span className="input-icon">
                        {/* email icon SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="modern-input has-label"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=" "
                      />
                      <label htmlFor="email" className="floating-label">
                        Email
                      </label>
                      <div className="input-glow"></div>
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <span className="input-icon">
                        {/* lock/password icon SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-8h-1V7a5 5 0 10-10 0v2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-7-2a3 3 0 016 0v2H11V7zm7 12H6v-8h12v8z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <input
                        type="password"
                        id="password"
                        className="modern-input has-label"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=" "
                      />
                      <label htmlFor="password" className="floating-label">
                        Password
                      </label>
                      <div className="input-glow"></div>
                    </div>
                  </div>

                  <button
                    className="auth-button signup-btn"
                    onClick={handleSignUp}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
            {/* 
            <button className="login-trigger" onClick={handleLoginClick}>
              Login
            </button> */}

            {!isLoginVisible && !isSignUp && (
              <div className="inline-login-link">
                <button
                  className="login-trigger link-style-btn"
                  onClick={() => {
                    setIsLoginVisible(true);
                  }}
                >
                  Login
                </button>
              </div>
            )}

            {isSignUp && (
              <div className="success-message">
                <div className="checkmark">✓</div>
                <p>Account created successfully!</p>
                <br />
                <button
                  className="auth-button login-btn"
                  onClick={() => {
                    setIsLoginVisible(true);
                    setIsSignUp(false);
                  }}
                >
                  Proceed to Login
                </button>
              </div>
            )}
          </div>

          {/* Login Form (slides up) */}
          <div className={`login-container ${isLoginVisible ? "visible" : ""}`}>
            <div className="login-header">
              <button className="back-button" onClick={handleBackClick}>
                ←
              </button>

              <div className="form-header">
                <h1
                  className="main-title logo-heading"
                  style={{ display: "flex", gap: "10px", alignItems: "center",justifyContent:'center' }}
                >
                  <span className="logo-icon" aria-hidden="true">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="VitalCare logo"
                    >
                      <defs>
                        <linearGradient
                          id="vc-grad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="32" r="30" fill="url(#vc-grad)" />
                      <path
                        d="M32 20c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                        fill="#fff"
                      />
                      <path
                        d="M44 30h-6v-6c0-1.104-.896-2-2-2h-4c-1.104 0-2 .896-2 2v6h-6c-1.104 0-2 .896-2 2v4c0 1.104.896 2 2 2h6v6c0 1.104.896 2 2 2h4c1.104 0 2-.896 2-2v-6h6c1.104 0 2-.896 2-2v-4c0-1.104-.896-2-2-2z"
                        fill="#fff"
                      />
                    </svg>
                  </span>
                  <span style={{ marginBottom: "8px" }}>BCS Care</span>
                </h1>{" "}
                <p>Monitor your health with precision</p>
              </div>
            </div>

            <div className="form-header">
              <h1 className="main-title">Login</h1>
              <div className="arrow-down">↓</div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="loginEmail"
                    placeholder=" "
                    className={`modern-input login-input has-label ${
                      email ? "has-value" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="loginEmail" className="floating-label">
                    Email
                  </label>
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-8h-1V7a5 5 0 10-10 0v2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-7-2a3 3 0 016 0v2H11V7zm7 12H6v-8h12v8z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="loginPassword"
                    placeholder=" "
                    className={`modern-input login-input has-label ${
                      password ? "has-value" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="loginPassword" className="floating-label">
                    Password
                  </label>
                  <div className="input-glow"></div>
                </div>
              </div>

              <button type="submit" className="auth-button login-btn">
                Login
              </button>
            </form>

            <div className="login-footer">
              <button className="forgot-password-btn">Forgot Password?</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

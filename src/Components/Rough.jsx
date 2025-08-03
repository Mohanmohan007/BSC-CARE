
import React, { useState, useEffect } from 'react';
import './SignIn.css';

export default function SignIn(onLogin, onNavigate ) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

  const medicalImages = [
    {
      title: "Heart Rate Monitor",
      subtitle: "Real-time cardiac monitoring",
      gradient: "linear-gradient(135deg, #ff6b6b, #ff8e8e)"
    },
    {
      title: "Respiratory Tracker",
      subtitle: "Advanced breathing analysis",
      gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)"
    },
    {
      title: "Vital Signs Dashboard",
      subtitle: "Complete health overview",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % medicalImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleBackClick = () => {
    setIsLoginVisible(false);
    setIsSignUp(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      onLogin({ email, fullName });
    } else {
      onLogin({ email, fullName: 'User' });
    }
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
              className={`slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ background: image.gradient }}
            >
              <div className="slide-content">
                <div className="medical-icon">
                  {index === 0 && <div className="heart-icon">💓</div>}
                  {index === 1 && <div className="lungs-icon">🫁</div>}
                  {index === 2 && <div className="chart-icon">📊</div>}
                </div>
                <h2>{image.title}</h2>
                <p>{image.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="slide-indicators">
          {medicalImages.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Side - iOS Style Form */}
      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <h1>VitalCare</h1>
            <p>Monitor your health with precision</p>
          </div>

          <div className={`signup-container ${isLoginVisible ? 'slide-up' : ''}`}>
        <div className="form-header">
          <h1 className="main-title">Sign up</h1>
          <div className="arrow-down">↓</div>
        </div>

        <div className="form-content">
          {!isSignUp && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="User name"
                  className="modern-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <div className="input-glow"></div>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="modern-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-glow"></div>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  className="modern-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-glow"></div>
              </div>

              <button className="auth-button signup-btn" onClick={() => setIsSignUp(true)}>
                Sign up
              </button>
            </>
          )}

          {isSignUp && (
            <div className="success-message">
              <div className="checkmark">✓</div>
              <p>Account created successfully!</p>
            </div>
          )}
        </div>

        <button className="login-trigger" onClick={handleLoginClick}>
          Login
        </button>
      </div>

      {/* Login Form (slides up) */}
      <div className={`login-container ${isLoginVisible ? 'visible' : ''}`}>
        <div className="login-header">
          <button className="back-button" onClick={handleBackClick}>
            ←
          </button>
          <h2 className="login-title">Login</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="modern-input login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="input-glow"></div>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="modern-input login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="input-glow"></div>
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









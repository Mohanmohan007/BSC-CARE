
import React, { useState, useEffect } from 'react';
import './Recording.css';
import { useRef } from 'react';
import startrecord from '../assets/startrecord.png';
import heart from "../assets/heart.png";
import lungs from "../assets/lungs.png";
import step1 from '../assets/step1.jpg';
import step2 from '../assets/step2.jpg';
import step3 from '../assets/step3.jpg';
import position from '../assets/Position.png'


export default function Recording({ onComplete, onNavigate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [respiratoryRate, setRespiratoryRate] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
  
  const stepsRef = useRef([]);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // if you want them to animate only once, you can unobserve here:
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    stepsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const containerRef = useRef(null);

useEffect(() => {
  // on mount, ensure viewport is at top of the recording content
  if (containerRef.current) {
    containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}, []);

  useEffect(() => {
    let interval;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsRecording(true);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    let interval;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1);
        // Simulate heart rate and respiratory rate detection
        setHeartRate(Math.floor(Math.random() * (85 - 60) + 60));
        setRespiratoryRate(Math.floor(Math.random() * (20 - 12) + 12));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);



  const stopRecording = () => {
    setIsRecording(false);
    onComplete({ heartRate, respiratoryRate });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const startRecording = () => {
  setCountdown(3);
  setRecordingTime(0);
  setHeartRate(0);
  setRespiratoryRate(0);
  setIsRecording(false);
};

const restartDuringRecording = () => {
  // if already recording, restart by going back to countdown
  setCountdown(3);
  setRecordingTime(0);
  setHeartRate(0);
  setRespiratoryRate(0);
  setIsRecording(false);
};

  return (
    <div className="ios-container">
       <div className="status-bar">
        <div className="status-left">
          <span className="time">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="status-right">
          <div className="battery-indicator">
            <div className="battery-level"></div>
          </div>
          <div className="signal-bars">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div className="ios-nav">
        <button 
          className="ios-nav-back"
          onClick={() => onNavigate('dashboard')}
        >
          ← Back
        </button>
        <h1 className="ios-nav-title">Recording</h1>
        <div></div>
      </div>

      <div className="recording-content" ref={containerRef}>
        <div className="instruction-card">
          <img src={position}></img>
          <div className="phone-illustration">
            📱
          </div>
          <h2>Position Your Phone</h2>
          <p>Place your phone gently on your neck, just below your jawline. Keep still during the recording.</p>
        </div>

          <div className="step-by-step-section">
          <h2>Step-by-Step Guide</h2>
          <div className="steps-container">
            <div className="step"  data-step="1"
    ref={(el) => (stepsRef.current[0] = el)}>
                <div className="step-illustration">
                     <div className="pulse-rings1">
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
              </div>
              <div className="step-number">1</div>
              </div>
              <div className="step-image-wrapper">
                <img src={step1} alt="Step 1: Hold phone and prepare position" className="step-image" />
              </div>
              <div className="step-description">
                <h3>Prepare Your Phone</h3>
                <p>Hold your phone and position it as shown. Ensure the camera/microphone area is clean and you're in a quiet space.</p>
              </div>
            </div>

            <div className="step"     data-step="2"
    ref={(el) => (stepsRef.current[1] = el)}>
<div className="step-illustration">
                     <div className="pulse-rings1">
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
              </div>
              <div className="step-number">2</div>
              </div>              <div className="step-image-wrapper">
                <img src={step2} alt="Step 2: Start recording and monitor vitals" className="step-image" />
              </div>
              <div className="step-description">
                <h3>Start Recording</h3>
                <p>Tap "Start Recording" and watch the live readings. Keep still and breathe normally while the app captures your heart and respiratory rates.</p>
              </div>
            </div>

            <div className="step"     data-step="3"
    ref={(el) => (stepsRef.current[2] = el)}>
<div className="step-illustration">
                     <div className="pulse-rings1">
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
                <div className="pulse-ring1"></div>
              </div>
              <div className="step-number">3</div>
              </div>              <div className="step-image-wrapper">
                <img src={step3} alt="Step 3: Relax while phone records" className="step-image" />
              </div>
              <div className="step-description">
                <h3>Relax During Measurement</h3>
                <p>Lie back or remain steady. Let the recording finish naturally, then stop to view your results.</p>
              </div>
            </div>
          </div>
        </div>

        {countdown !== null && (
          <div className="countdown-display">
            <div className="countdown-circle">
              <span className="countdown-number">{countdown}</span>
            </div>
            <p>Recording starts in...</p>
          </div>
        )}

        {isRecording && (
          <div className="recording-active">
          <div className="recording-timer" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="timer-text">{formatTime(recordingTime)}</span>
        <div className="recording-pulse"></div>
      </div>
      <button
        className="ios-button"
        onClick={restartDuringRecording}
        style={{
          padding: '9px 6px',
          fontSize:'14px',
          width:'90px',
          borderRadius: '14px',
          background: 'rgb(87 255 115 / 35%)',
          color: '#1c1c1e',
          fontWeight: 600,
          boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
          flexShrink: 0
        }}
      >
        Restart
      </button>
    </div>


            <div className="live-readings">
              <div className="reading-card">
 <div className="vital-icon-container">
                  <div className="vital-icon heart-icon2">
                    <div className="heartbeat-animation"><img src={heart}></img></div>
                  </div>
                  <div className="vital-wave"></div>
                </div>                <div className="reading-info">
                  <span className="reading-value">{heartRate}</span>
                  <span className="reading-label">Heart Rate (BPM)</span>
                </div>
              </div>

              <div className="reading-card">
  <div className="vital-icon-container">
                  <div className="vital-icon lung-icon">
                    <div className="breathing-animation"><img src={lungs}></img></div>
                  </div>
                  <div className="vital-wave respiratory-wave"></div>
                </div>                <div className="reading-info">
                  <span className="reading-value">{respiratoryRate}</span>
                  <span className="reading-label">Respiratory Rate (RPM)</span>
                </div>
              </div>
            </div>

            <div className="recording-controls">
              <button 
                className="ios-button danger stop-button"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            </div>
          </div>
        )}
{!isRecording && countdown === null && (
  <div className="recording-ready">
    <div className="ready-illustration">
      <div className="pulse-rings">
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
      </div>
      <div className="heart-center"><img src={startrecord} alt="Start recording" /></div>
    </div>

    <h2>Ready to Record</h2>
    <p>Make sure you're in a quiet environment and positioned comfortably.</p>

    <div className="recording-ready-actions" style={{ display: 'flex', gap: '12px', width: '100%' }}>
      <button 
        className="ios-button start-button"
        onClick={startRecording}
        style={{ flex: 1 }}
      >
        Start Recording
      </button>
      
    </div>
  </div>
)}


       

      </div>
    </div>
  );
}

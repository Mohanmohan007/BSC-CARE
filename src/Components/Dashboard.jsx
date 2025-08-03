import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import showtitle2 from "../assets/showTitle2.png";
import StartYour from "../assets/StartYour.png";
import ResultIcon from "../assets/ResultIcon.png";
import readings from "../assets/readings.png";
import heartrate from "../assets/heartrate.png";
import rightdown from "../assets/rightdown.png";
import rightuppp from "../assets/rightuppp.png";
import clock from "../assets/clock.png";
import heart from "../assets/heart.png";
import lungs from "../assets/lungs.png";
import thermometer from "../assets/thermometer.png";
import hi from "../assets/hi.png";

export default function Dashboard({ user, recordings, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationClass, setAnimationClass] = useState("");

  // Use provided props or fallback to mock data
  const defaultUser = user || { fullName: "Sarah Johnson" };
  const defaultRecordings = recordings || [
    {
      id: 1,
      heartRate: 72,
      respiratoryRate: 16,
      timestamp: new Date(Date.now() - 86400000),
      bodyTemp: 98.6,
    },
    {
      id: 2,
      heartRate: 78,
      respiratoryRate: 18,
      timestamp: new Date(Date.now() - 172800000),
      bodyTemp: 98.4,
    },
    {
      id: 3,
      heartRate: 75,
      respiratoryRate: 17,
      timestamp: new Date(Date.now() - 259200000),
      bodyTemp: 98.7,
    },
  ];

  const latestRecording = defaultRecordings[defaultRecordings.length - 1];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAnimationClass("animate-in");
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHealthStatus = (heartRate) => {
    if (heartRate >= 60 && heartRate <= 80)
      return { status: "Excellent", color: "#00D4AA" };
    if (heartRate >= 50 && heartRate <= 90)
      return { status: "Good", color: "#4CAF50" };
    return { status: "Monitor", color: "#FF9500" };
  };

  const healthStatus = latestRecording
    ? getHealthStatus(latestRecording.heartRate)
    : null;

  const handleRecordingClick = () => {
    if (onNavigate) {
      onNavigate("recording");
    }
  };

  const handleResultsClick = () => {
    if (onNavigate) {
      onNavigate("results");
    }
  };

  

  return (
    <div className={`dashboard-container ${animationClass}`}>
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="time">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="status-right">
          <div className="battery-indicator">
            <div className="battery-level"></div>
          </div>
          <div className="signal-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-header">
        <div className="nav-content dfefcd_v">
          <div>
            <h1 className="nav-title">BCS Care</h1>
            <div className="nav-subtitle">Health Monitoring</div>
          </div>
          <div className="showTile_dct">
            <img src={showtitle2}></img>
          </div>
        </div>

        <div className="euwiduiwe">
          <div className="profile-btn">
            <div className="profile-avatar">
              {defaultUser?.fullName?.charAt(0) || "U"}
            </div>
            <button
              aria-label="View results"
              className="result-icon-btn"
              onClick={handleResultsClick}
              title="Results"
              type="button"
            >
              <img src={ResultIcon}></img>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>
              Hello, {defaultUser?.fullName?.split(" ")[0] || "User"}!{" "}
              <img src={hi}></img>
            </h2>
            <p>How are you feeling today?</p>
          </div>
          {healthStatus && (
            <div
              className="health-badge"
              style={{ backgroundColor: healthStatus.color }}
            >
              <span className="pulse-dot"></span>
              {healthStatus.status}
            </div>
          )}
        </div>

        {/* Latest Reading Card */}
        {latestRecording && (
          <div className="vitals-card primary-card">
            <div className="card-header">
              <div className="card-title">
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  Latest Reading
                </div>
                <span className="reading-time">
                  {formatDate(latestRecording.timestamp)}
                </span>
              </div>
            </div>

            <div className="vitals-grid">
              <div className="vital-item heart-rate">
                <div className="vital-icon-container">
                  <div className="vital-icon heart-icon2">
                    <div className="heartbeat-animation">
                      <img src={heart}></img>
                    </div>
                  </div>
                  <div className="vital-wave"></div>
                </div>
                <div className="vital-data">
                  <span className="vital-value">
                    {latestRecording.heartRate}
                  </span>
                  <span className="vital-unit">BPM</span>
                  <span className="vital-label">Heart Rate</span>
                </div>
              </div>

              <div className="vital-item respiratory">
                <div className="vital-icon-container">
                  <div className="vital-icon lung-icon">
                    <div className="breathing-animation">
                      <img src={lungs}></img>
                    </div>
                  </div>
                  <div className="vital-wave respiratory-wave"></div>
                </div>
                <div className="vital-data">
                  <span className="vital-value">
                    {latestRecording.respiratoryRate}
                  </span>
                  <span className="vital-unit">RPM</span>
                  <span className="vital-label">Respiratory</span>
                </div>
              </div>

              {/* <div className="vital-item temperature">
                <div className="vital-icon-container">
                  <div className="vital-icon temp-icon">
                    <div className="temp-animation">🌡️</div>
                  </div>
                </div>
                <div className="vital-data">
                  <span className="vital-value">{latestRecording.bodyTemp || '98.6'}</span>
                  <span className="vital-unit">°F</span>
                  <span className="vital-label">Body Temp</span>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <img src={readings}></img>
            </div>
            <div className="stat-info">
              <span className="stat-number">{defaultRecordings.length}</span>
              <span className="stat-label">Total Readings</span>
            </div>
            <div className="stat-trend positive">
              <img src={rightuppp}></img>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src={heartrate}></img>
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {defaultRecordings.length > 0
                  ? Math.round(
                      defaultRecordings.reduce(
                        (sum, r) => sum + r.heartRate,
                        0
                      ) / defaultRecordings.length
                    )
                  : "--"}
              </span>
              <span className="stat-label">Avg Heart Rate</span>
            </div>
            <div className="stat-trend neutral">
              <img src={rightdown}></img>
            </div>
          </div>
        </div>

        {/* Recent Readings */}
        {defaultRecordings.length > 0 && (
          <div className="recent-card">
            <div className="card-header">
              <h3 className="recent-activity-title">
                <span className="title-bar">
                  <img src={clock}></img>
                </span>
                Recent Activity
              </h3>
              <button className="view-all-btn" onClick={handleResultsClick}>
                View All
              </button>
            </div>

            <div className="readings-list">
              {defaultRecordings
                .slice(-3)
                .reverse()
                .map((recording, index) => (
                  <div
                    key={recording.id}
                    className="reading-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="reading-date-container">
                      <div className="reading-date">
                        {formatDate(recording.timestamp)}
                      </div>
                      <div className="reading-day">
                        {new Date(recording.timestamp).toLocaleDateString(
                          "en-US",
                          { weekday: "short" }
                        )}
                      </div>
                    </div>

                    <div className="reading-metrics">
                      <div className="metric">
                        <span className="metric-icon">
                          <img src={heart}></img>
                        </span>
                        <span className="metric-value">
                          {recording.heartRate}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">
                          <img src={lungs}></img>
                        </span>
                        <span className="metric-value">
                          {recording.respiratoryRate}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">
                          <img src={thermometer}></img>
                        </span>
                        <span className="metric-value">
                          {recording.bodyTemp || "98.6"}°
                        </span>
                      </div>
                    </div>

                    <div className="reading-status">
                      <div
                        className="status-dot"
                        style={{
                          backgroundColor: getHealthStatus(recording.heartRate)
                            .color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {defaultRecordings.length === 0 && (
          <div className="empty-state">
            <div className="empty-animation">
              <div className="pulse-ring"></div>
              <div className="empty-icon">
                <img src={StartYour}></img>
              </div>
            </div>
            <h3>Start Your Health Journey</h3>
            <p>
              Record your first vitals to begin monitoring your health trends
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleRecordingClick} aria-label="Start recording">
  <div className="fab-bg" />
  <div className="fab-sheen" aria-hidden="true" />
  <div className="fab-icon">
    <span className="plus-vertical" />
    <span className="plus-horizontal" />
  </div>
  <div className="fab-ripple" />
</button>
    </div>
  );
}

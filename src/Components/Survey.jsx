import React, { useState, useEffect } from "react";
import "./Survey.css";
import StartYour2 from "../assets/StartYour2.png";
import surveyYes from '../assets/SurveyYes.png';

export default function Survey({ recording, onComplete, onNavigate }) {
  const [formData, setFormData] = useState({
    bodyTemperature: "",
    unit: "F", // default to Fahrenheit
    headache: null,
    bodyPain: null,
    fatigue: null,
    cough: null,
    difficultyBreathing: null,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const hasAllAnswers = Object.entries(formData).every(([key, value]) => {
      if (key === "bodyTemperature") return value !== "";
      return value !== null;
    });

    if (!hasAllAnswers) {
      alert("Please answer all questions");
      return;
    }

    onComplete(formData);
  };

  const questions = [
    {
      key: "headache",
      question: "Do you have a headache?",
      type: "boolean",
    },
    {
      key: "bodyPain",
      question: "Do you have any body pain?",
      type: "boolean",
    },
    {
      key: "fatigue",
      question: "Are you feeling fatigued?",
      type: "boolean",
    },
    {
      key: "cough",
      question: "Do you have a cough?",
      type: "boolean",
    },
    {
      key: "difficultyBreathing",
      question: "Any difficulty breathing?",
      type: "boolean",
    },
  ];

  // Helper conversions and status
  const toCelsius = (f) => ((parseFloat(f) - 32) * 5) / 9;
  const toFahrenheit = (c) => (parseFloat(c) * 9) / 5 + 32;

  const getStatus = (temp, unit) => {
    if (temp === "" || isNaN(temp))
      return { label: "—", level: 0, color: "#d1d1d6" };
    let c;
    if (unit === "F") c = toCelsius(temp);
    else c = parseFloat(temp);
    // thresholds in Celsius
    if (c <= 37.2)
      return {
        label: "Normal",
        level: Math.min(Math.max((c - 35) / 5, 0), 1),
        color: "#28a745",
      };
    if (c <= 38)
      return {
        label: "Low-grade Fever",
        level: Math.min(Math.max((c - 37.2) / 1.8, 0), 1),
        color: "#ffc107",
      };
    if (c <= 39)
      return {
        label: "Fever",
        level: Math.min(Math.max((c - 38) / 2, 0), 1),
        color: "#fd7e14",
      };
    return { label: "High Fever", level: 1, color: "#dc3545" };
  };

  return (
    <div className="ios-container">
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
      <div className="ios-nav">
        <button
          className="ios-nav-back"
          onClick={() => onNavigate("recording")}
        >
          ← Back
        </button>
        <h1 className="ios-nav-title">Health Survey</h1>
        <div></div>
      </div>

      <div className="survey-content">
        <div className="survey-header">
          <div className="empty-animation">
            <div className="pulse-ring2"></div>
            <div className="completion-icon empty-icon">
              <img src={StartYour2}></img>
            </div>
          </div>

          <h2>Recording Complete!</h2>
          <p>
            Please answer a few quick questions about your current health
            status.
          </p>
        </div>



        <form className="survey-form" onSubmit={handleSubmit}>
          <div className="ios-card wdq_hhdd">
            <div className="ios-card-header">
              <h3>Body Temperature</h3>
            </div>
            <div className="ios-card-content sdsfsdf">
              <div className="unit-toggle">
                <button
                  type="button"
                  className={`unit-btn ${
                    formData.unit === "F" ? "active" : ""
                  }`}
                  onClick={() => handleInputChange("unit", "F")}
                >
                  °F
                </button>
                <button
                  type="button"
                  className={`unit-btn ${
                    formData.unit === "C" ? "active" : ""
                  }`}
                  onClick={() => handleInputChange("unit", "C")}
                >
                  °C
                </button>
              </div>
              <div className="temperature-input">
                <input
                  type="number"
                  step="0.1"
                  className="ios-input"
                  placeholder={formData.unit === "F" ? "98.6" : "37.0"}
                  value={formData.bodyTemperature}
                  onChange={(e) =>
                    handleInputChange("bodyTemperature", e.target.value)
                  }
                />
                <span className="temperature-unit">°{formData.unit}</span>
              </div>

              {/* Status bar and label */}
              {(() => {
                const status = getStatus(
                  formData.bodyTemperature,
                  formData.unit
                );
                return (
                  <div className="temperature-status-wrapper">
                    <div
                      className="status-label"
                      style={{ color: status.color }}
                    >
                      {status.label}
                    </div>
                    <div className="thermometer">
                      <div
                        className="thermometer-fill"
                        style={{
                          width: `${Math.min(
                            Math.max(status.level * 100, 0),
                            100
                          )}%`,
                          background: status.color,
                        }}
                      />
                      <div className="thermometer-scale">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="ios-card dsdcwdeee">
            <div className="ios-card-header">
              <h3>Symptoms Check</h3>
            </div>
            <div   className="ios-card-content wedw_jmii"
  style={{ "--bg-image": `url(${surveyYes})` }}
>
              {questions.map((q, index) => (
                <div key={q.key} className="question-item">
                  <label className="question-label">{q.question}</label>
                  <div className="answer-buttons">
                    <button
                      type="button"
                      className={`answer-button yes ${
                        formData[q.key] === true ? "selected" : ""
                      }`}
                      onClick={() => handleInputChange(q.key, true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`answer-button no ${
                        formData[q.key] === false ? "selected" : ""
                      }`}
                      onClick={() => handleInputChange(q.key, false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="ios-button start-button">
            Complete Survey
          </button>
        </form>
      </div>
    </div>
  );
}

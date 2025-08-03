
import React, { useState } from 'react';
import './App.css';
import SignIn from './Components/SignIn';
import Recording from './Components/Recording';
import Survey from './Components/Survey';
import Results from './Components/Results';
import Dashboard from './Components/Dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('signin');
  const [user, setUser] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);

  const navigate = (screen, data = null) => {
    setCurrentScreen(screen);
    if (data) {
      if (screen === 'survey') {
        setCurrentRecording(data);
      }
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('dashboard');
  };

  const handleRecordingComplete = (recordingData) => {
    const newRecording = {
      id: Date.now(),
      heartRate: recordingData.heartRate,
      respiratoryRate: recordingData.respiratoryRate,
      timestamp: new Date(),
      survey: null
    };
    setCurrentRecording(newRecording);
    navigate('survey');
  };

  const handleSurveyComplete = (surveyData) => {
    const completedRecording = {
      ...currentRecording,
      survey: surveyData
    };
    setRecordings([...recordings, completedRecording]);
    navigate('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return <SignIn onLogin={handleLogin} onNavigate={navigate} />;
      case 'dashboard':
        return (
          <Dashboard
            user={user} 
            recordings={recordings} 
            onNavigate={navigate} 
          />
        );
      case 'recording':
        return (
          <Recording 
            onComplete={handleRecordingComplete} 
            onNavigate={navigate} 
          />
        );
      case 'survey':
        return (
          <Survey 
            recording={currentRecording}
            onComplete={handleSurveyComplete} 
            onNavigate={navigate} 
          />
        );
      case 'results':
        return (
          <Results 
            recordings={recordings} 
            onNavigate={navigate} 
          />
        );
      default:
        return <SignIn onLogin={handleLogin} onNavigate={navigate} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

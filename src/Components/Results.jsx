import './Results.css';
import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceArea, BarChart, Bar, ScatterChart, Scatter, AreaChart, Area,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';


import heart from "../assets/heart.png";
import lungs from "../assets/lungs.png";
import thermometer from "../assets/thermometer.png";

// Utility functions
const movingAverage = (data, key, window = 5) => {
  const res = [];
  for (let i = 0; i < data.length; i++) {
    const slice = data.slice(Math.max(0, i - (window - 1)), i + 1);
    const avg = slice.reduce((sum, d) => sum + (d[key] || 0), 0) / slice.length;
    res.push({ ...data[i], [`${key}_ma`]: parseFloat(avg.toFixed(1)) });
  }
  return res;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const computeDelta = (current, previous) => {
  if (previous == null) return null;
  const diff = current - previous;
  const sign = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
  return `${sign}${Math.abs(diff)}`;
};

const getHealthStatus = (recording) => {
  const { heartRate, respiratoryRate, survey } = recording;
  const normalHR = heartRate >= 60 && heartRate <= 100;
  const normalRR = respiratoryRate >= 12 && respiratoryRate <= 20;
  const noSymptoms = survey && !Object.values(survey).slice(1).some(val => val === true);
  const normalTemp = survey && parseFloat(survey.bodyTemperature) < 99.5;

  if (normalHR && normalRR && noSymptoms && normalTemp) {
    return { status: 'Good', color: '#34c759', className: 'good' };
  } else if (!normalHR || !normalRR || (survey && parseFloat(survey.bodyTemperature) >= 100)) {
    return { status: 'Attention', color: '#ff3b30', className: 'attention' };
  } else {
    return { status: 'Monitor', color: '#ff9500', className: 'monitor' };
  }
};

const buildHistogram = (values, buckets = 6) => {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const bucketSize = range / buckets;
  const counts = Array(buckets).fill(0);
  values.forEach(v => {
    let idx = Math.floor((v - min) / bucketSize);
    if (idx === buckets) idx = buckets - 1;
    counts[idx]++;
  });
  return counts.map((count, i) => ({
    bucket: `${(min + i * bucketSize).toFixed(0)}-${(min + (i + 1) * bucketSize).toFixed(0)}`,
    count,
  }));
};

export default function Results({ recordings = [], onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sort recordings chronologically
  const sorted = useMemo(() => 
    [...recordings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), 
    [recordings]
  );

  // Enhanced data with moving averages
  const withHRMA = useMemo(() => movingAverage(sorted, 'heartRate', 5), [sorted]);
  const withRRMA = useMemo(() => movingAverage(sorted, 'respiratoryRate', 5), [sorted]);

  // Statistics
  const latest = sorted[sorted.length - 1] || null;
  const previous = sorted[sorted.length - 2] || null;

  const avgHR = useMemo(() => {
    if (!sorted.length) return 0;
    return (sorted.reduce((s, r) => s + r.heartRate, 0) / sorted.length).toFixed(1);
  }, [sorted]);
  
  const avgRR = useMemo(() => {
    if (!sorted.length) return 0;
    return (sorted.reduce((s, r) => s + r.respiratoryRate, 0) / sorted.length).toFixed(1);
  }, [sorted]);

  // Health distribution
  const healthDistribution = useMemo(() => {
    const statusCounts = { Good: 0, Monitor: 0, Attention: 0 };
    sorted.forEach(recording => {
      const health = getHealthStatus(recording);
      statusCounts[health.status]++;
    });
    
    const total = sorted.length || 1;
    return [
      { name: 'Good', value: statusCounts.Good, percentage: Math.round((statusCounts.Good / total) * 100), color: '#34C759' },
      { name: 'Monitor', value: statusCounts.Monitor, percentage: Math.round((statusCounts.Monitor / total) * 100), color: '#FF9500' },
      { name: 'Attention', value: statusCounts.Attention, percentage: Math.round((statusCounts.Attention / total) * 100), color: '#FF3B30' },
    ];
  }, [sorted]);

  // Histograms
  const last30 = useMemo(() => sorted.slice(Math.max(0, sorted.length - 30)), [sorted]);
  const hrHistogram = useMemo(() => buildHistogram(last30.map(r => r.heartRate)), [last30]);

  const COLORS = ['#34C759', '#FF9500', '#FF3B30'];

  if (recordings.length === 0) {
    return (
      <div className="ios-container">
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
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="ios-nav">
          <button 
            className="ios-nav-back"
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>
          <h1 className="ios-nav-title">Health Results</h1>
          <div className="w-16"></div>
        </div>

        <div className="results-content">
          <div className="empty-results">
            <div className="empty-icon">📊</div>
            <h2>No Results Yet</h2>
            <p>Start recording your vitals to see your health trends here.</p>
            <button 
              className="ios-button"
              onClick={() => onNavigate('dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-container">
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
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="ios-nav">
        <button 
          className="ios-nav-back"
          onClick={() => onNavigate('dashboard')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        <h1 className="ios-nav-title">Health Results</h1>
        <div className="w-16"></div>
      </div>

      <div className="results-content">
        {/* Summary Cards */}
        <div className="summary-row">
          <div className="summary-card chart-card">
            <div className="summary-card-content">
              <div className="summary-icon heart-rate-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div className="summary-value">
                <div className="large">{latest?.heartRate || 0}</div>
                <div className="sub">BPM</div>
              </div>
            </div>
            <div className="summary-title">Heart Rate</div>
            <div className="delta-badge">
              {computeDelta(latest?.heartRate || 0, previous?.heartRate) || '—'} since last
            </div>
          </div>

          <div className="summary-card chart-card">
            <div className="summary-card-content">
              <div className="summary-icon respiratory-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11l.707-.707A1 1 0 0113.414 10H15M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="summary-value">
                <div className="large">{latest?.respiratoryRate || 0}</div>
                <div className="sub">RPM</div>
              </div>
            </div>
            <div className="summary-title">Respiratory Rate</div>
            <div className="delta-badge respiratory-delta">
              {computeDelta(latest?.respiratoryRate || 0, previous?.respiratoryRate) || '—'} since last
            </div>
          </div>

          <div className="summary-card chart-card">
            <div className="summary-card-content">
              <div className="summary-icon temperature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="summary-value">
                <div className="large">{latest?.survey?.bodyTemperature || '98.6'}</div>
                <div className="sub">°F</div>
              </div>
            </div>
            <div className="summary-title">Temperature</div>
            <div className="delta-badge temperature-delta">Normal Range</div>
          </div>

          <div className="summary-card chart-card">
            <div className="summary-card-content">
              <div className="summary-icon health-score-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="summary-value">
                <div className="large composite-score">
                  {latest ? (getHealthStatus(latest).status === 'Good' ? '95' : getHealthStatus(latest).status === 'Monitor' ? '75' : '50') : '0'}
                </div>
                <div className="sub">Score</div>
              </div>
            </div>
            <div className="summary-title">Health Score</div>
            <div className="delta-badge health-delta">
              {latest ? getHealthStatus(latest).status : 'Unknown'}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="multi-chart">
          {/* Heart Rate Trend */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="ios-card-header">
                <div className="chart-title-section">
                  <h3>Heart Rate Trend</h3>
                  <p className="small-title">BPM over time with moving average</p>
                </div>
                <div className="chart-icon heart-rate-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="chart-container-modern">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={withHRMA}>
                    <defs>
                      <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      stroke="#8E8E93"
                      fontSize={12}
                    />
                    <YAxis domain={[50, 'dataMax + 10']} stroke="#8E8E93" fontSize={12} />
                    <Tooltip
                      labelFormatter={(value) => formatDate(value)}
                      formatter={(value, name) => {
                        if (name === 'heartRate') return [`${value} BPM`, 'Heart Rate'];
                        if (name === 'heartRate_ma') return [`${value} BPM`, 'Moving Average'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <ReferenceArea y1={60} y2={100} fill="#34C759" fillOpacity={0.1} />
                    <Area 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#FF3B30" 
                      strokeWidth={3}
                      fill="url(#heartRateGradient)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="heartRate_ma" 
                      stroke="#FF9500" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-stats">
                <div className="stat">
                  <span className="label">Average</span>
                  <span className="value">{avgHR} BPM</span>
                </div>
                <div className="stat">
                  <span className="label">Normal Range</span>
                  <span className="value">60-100 BPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Respiratory Rate Trend */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="ios-card-header">
                <div className="chart-title-section">
                  <h3>Respiratory Rate</h3>
                  <p className="small-title">RPM over time with reference zones</p>
                </div>
                <div className="chart-icon respiratory-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11l.707-.707A1 1 0 0113.414 10H15M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="chart-container-modern">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={withRRMA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      stroke="#8E8E93"
                      fontSize={12}
                    />
                    <YAxis domain={[8, 'dataMax + 5']} stroke="#8E8E93" fontSize={12} />
                    <Tooltip
                      labelFormatter={(value) => formatDate(value)}
                      formatter={(value, name) => {
                        if (name === 'respiratoryRate') return [`${value} RPM`, 'Respiratory Rate'];
                        if (name === 'respiratoryRate_ma') return [`${value} RPM`, 'Moving Average'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <ReferenceArea y1={12} y2={20} fill="#007AFF" fillOpacity={0.1} />
                    <Line 
                      type="monotone" 
                      dataKey="respiratoryRate" 
                      stroke="#007AFF" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#007AFF' }}
                      activeDot={{ r: 6, fill: '#007AFF' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="respiratoryRate_ma" 
                      stroke="#5AC8FA" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-stats">
                <div className="stat">
                  <span className="label">Average</span>
                  <span className="value">{avgRR} RPM</span>
                </div>
                <div className="stat">
                  <span className="label">Normal Range</span>
                  <span className="value">12-20 RPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Distribution */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="ios-card-header">
                <div className="chart-title-section">
                  <h3>Health Distribution</h3>
                  <p className="small-title">Status breakdown over time</p>
                </div>
                <div className="chart-icon health-distribution-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="chart-container-modern">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} readings`, name]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {healthDistribution.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="legend-text">
                      {entry.name}: {entry.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heart Rate Histogram */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="ios-card-header">
                <div className="chart-title-section">
                  <h3>Heart Rate Distribution</h3>
                  <p className="small-title">Frequency histogram (last 30 readings)</p>
                </div>
                <div className="chart-icon histogram-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="chart-container-modern">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hrHistogram}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="bucket" stroke="#8E8E93" fontSize={11} />
                    <YAxis allowDecimals={false} stroke="#8E8E93" fontSize={12} />
                    <Tooltip
                      formatter={(value) => [`${value} readings`, 'Frequency']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                      fill="#FF3B30"
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed History */}
        <div className="ios-card ddesedec3">
          <div className="ios-card-header ew4rf4ef_rre">
            <div className='jhhjfd5tf'>
              <div>
            <h3>Detailed History</h3>
            <p className="small-title">Complete timeline of your health recordings</p>
        </div>
         <div className="chart-icon respiratory-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12 11l.707-.707A1 1 0 0113.414 10H15M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div> </div>
          </div>
          <div className="ios-card-content regry5r5_gfhe454">
            {sorted.slice().reverse().map((recording, index) => {
              const health = getHealthStatus(recording);
              return (
                <div key={recording.id || index} className="result-item">
                  <div className="result-header">
                    <span className="result-date">
                      {new Date(recording.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span 
                      className={`health-status ${health.className}`}
                      style={{ color: health.color }}
                    >
                      {health.status}
                    </span>
                  </div>
                  
                  <div className="result-vitals">
                    <div className="vital-reading">
                      <span className="vital-icon ewfwecc esdsccx"><img src={heart}></img></span>
                      <span>{recording.heartRate} BPM</span>
                    </div>
                    <div className="vital-reading">
                      <span className="vital-icon ewfwecc esdsccxee"><img src={lungs}></img></span>
                      <span>{recording.respiratoryRate} RPM</span>
                    </div>
                    {recording.survey && (
                      <div className="vital-reading">
                        <span className="vital-icon ewfwecc esdsccxrr"><img src={thermometer}></img></span>
                        <span>{recording.survey.bodyTemperature}°F</span>
                      </div>
                    )}
                  </div>
                  
                  {recording.survey && (
                    <div className="survey-summary">
                      <span className="symptoms-count">
                        {Object.values(recording.survey).slice(1).filter(val => val === true).length} symptoms reported
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
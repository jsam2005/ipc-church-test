import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

interface TestResult {
  userName: string;
  userPhone: string;
  score: number;
  totalQuestions: number;
  answers: { [key: number]: string };
  timestamp: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials (you can change this)
  const ADMIN_PASSWORD = 'church2024';

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    try {
      const storedResults = localStorage.getItem('churchTestResults');
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password!');
    }
  };

  const getTopWinners = () => {
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const getScorePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  const exportResults = () => {
    const csvContent = [
      ['Name', 'Phone', 'Score', 'Percentage', 'Timestamp'],
      ...results.map(result => [
        result.userName,
        result.userPhone,
        result.score,
        getScorePercentage(result.score, result.totalQuestions),
        result.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllResults = () => {
    if (confirm('Are you sure you want to clear all results? This cannot be undone!')) {
      localStorage.removeItem('churchTestResults');
      setResults([]);
      alert('All results have been cleared!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-container">
          <h2 className="admin-title">Admin Login</h2>
          <p className="admin-subtitle">Enter admin password to access results</p>
          
          <form onSubmit={handleLogin} className="admin-form">
            <div className="password-group">
              <label htmlFor="adminPassword" className="password-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  className="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <button type="submit" className="admin-login-btn">
              LOGIN
            </button>
          </form>
          
          <button className="back-btn" onClick={onBack}>
            ← Back to Test
          </button>
        </div>
      </div>
    );
  }

  const topWinners = getTopWinners();

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">IPC Church Test - Admin Panel</h1>
        <div className="admin-actions">
          <button className="export-btn" onClick={exportResults}>
            📊 Export CSV
          </button>
          <button className="clear-btn" onClick={clearAllResults}>
            🗑️ Clear All
          </button>
          <button className="back-btn" onClick={onBack}>
            ← Back to Test
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Participants</h3>
          <p className="stat-number">{results.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-number">
            {results.length > 0 
              ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
              : 0
            }/{results.length > 0 ? results[0].totalQuestions : 25}
          </p>
        </div>
        <div className="stat-card">
          <h3>Highest Score</h3>
          <p className="stat-number">
            {results.length > 0 ? Math.max(...results.map(r => r.score)) : 0}/{results.length > 0 ? results[0].totalQuestions : 25}
          </p>
        </div>
      </div>

      {topWinners.length > 0 && (
        <div className="winners-section">
          <h2 className="winners-title">🏆 Top 3 Winners</h2>
          <div className="winners-grid">
            {topWinners.map((winner, index) => (
              <div key={index} className={`winner-card ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}>
                <div className="winner-rank">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="winner-info">
                  <h3 className="winner-name">{winner.userName}</h3>
                  <p className="winner-phone">{winner.userPhone}</p>
                  <p className="winner-score">
                    {winner.score}/{winner.totalQuestions} 
                    ({getScorePercentage(winner.score, winner.totalQuestions)}%)
                  </p>
                  <p className="winner-time">{winner.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-section">
        <h2 className="results-title">All Results ({results.length})</h2>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results
                .sort((a, b) => b.score - a.score)
                .map((result, index) => (
                  <tr key={index} className={index < 3 ? 'top-three' : ''}>
                    <td className="rank-cell">
                      {index + 1}
                      {index === 0 && ' 🥇'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </td>
                    <td className="name-cell">{result.userName}</td>
                    <td className="phone-cell">{result.userPhone}</td>
                    <td className="score-cell">
                      {result.score}/{result.totalQuestions}
                    </td>
                    <td className="percentage-cell">
                      {getScorePercentage(result.score, result.totalQuestions)}%
                    </td>
                    <td className="timestamp-cell">{result.timestamp}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {results.length === 0 && (
        <div className="no-results">
          <h3>No test results yet</h3>
          <p>Results will appear here once users complete the test.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

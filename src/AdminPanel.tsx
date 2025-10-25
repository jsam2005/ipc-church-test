import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

interface DetailedAnswer {
  questionNumber: number;
  questionText: string;
  userAnswer: string | null;
  userAnswerText: string;
  correctAnswer: string | null;
  correctAnswerText: string;
  isCorrect: boolean;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface TestResult {
  userName: string;
  userPhone: string;
  score: number;
  totalQuestions: number;
  answers: string[];
  detailedAnswers: DetailedAnswer[];
  timestamp: string;
}

interface RankedResult extends TestResult {
  percentage: number;
  rank: number;
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [rankedResults, setRankedResults] = useState<RankedResult[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials
  const ADMIN_PASSWORD = 'church2024';

  useEffect(() => {
    if (isAuthenticated) {
      loadResults();
    }
  }, [isAuthenticated]);

  const loadResults = () => {
    try {
      const storedResults = localStorage.getItem('churchTestResults');
      console.log('🔍 Admin Panel - Raw localStorage data:', storedResults);
      
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        console.log('🔍 Admin Panel - Parsed results:', parsedResults);
        console.log('🔍 Admin Panel - Number of results:', parsedResults.length);
        setResults(parsedResults);
        calculateRankings(parsedResults);
      } else {
        console.log('🔍 Admin Panel - No stored results found');
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const calculateRankings = (testResults: TestResult[]) => {
    const resultsWithPercentage = testResults.map(result => ({
      ...result,
      percentage: (result.score / result.totalQuestions) * 100,
    }));

    const sortedResults = resultsWithPercentage.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage; // Higher percentage first
      }
      // Tie-breaking: earlier timestamp wins
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    setRankedResults(sortedResults.map((result, index) => ({ ...result, rank: index + 1 })));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const getScorePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  const exportDetailedCSV = () => {
    if (results.length === 0) {
      alert('No results to export.');
      return;
    }

    // Create comprehensive CSV with all details
    const headers = [
      'S.No', 'Name', 'Phone', 'Score', 'Total Questions', 'Percentage', 'Timestamp'
    ];
    
    // Add question columns with full details
    const maxQuestions = Math.max(...results.map(r => r.totalQuestions));
    for (let i = 1; i <= maxQuestions; i++) {
      headers.push(`Q${i}_Question`);
      headers.push(`Q${i}_UserAnswer`);
      headers.push(`Q${i}_CorrectAnswer`);
      headers.push(`Q${i}_Status`);
      headers.push(`Q${i}_OptionA`);
      headers.push(`Q${i}_OptionB`);
      headers.push(`Q${i}_OptionC`);
      headers.push(`Q${i}_OptionD`);
    }
    
    const csvRows = [headers];
    
    results.forEach((result, resultIndex) => {
      const row = [
        resultIndex + 1, // S.No
        result.userName,
        result.userPhone,
        result.score,
        result.totalQuestions,
        getScorePercentage(result.score, result.totalQuestions) + '%',
        result.timestamp
      ];
      
      // Add detailed question data
      for (let i = 0; i < maxQuestions; i++) {
        const detailedAnswer = result.detailedAnswers[i];
        if (detailedAnswer) {
          row.push(detailedAnswer.questionText);
          row.push(detailedAnswer.userAnswerText);
          row.push(detailedAnswer.correctAnswerText);
          row.push(detailedAnswer.isCorrect ? 'Correct' : 'Wrong');
          row.push(detailedAnswer.optionA);
          row.push(detailedAnswer.optionB);
          row.push(detailedAnswer.optionC);
          row.push(detailedAnswer.optionD);
        } else {
          // Fill with empty values if no detailed answer
          row.push('', '', '', '', '', '', '', '');
        }
      }
      
      csvRows.push(row.map(cell => String(cell)));
    });

    const csvContent = csvRows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-test-detailed-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllResults = () => {
    if (confirm('Are you sure you want to clear all results? This cannot be undone!')) {
      localStorage.removeItem('churchTestResults');
      setResults([]);
      setRankedResults([]);
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
                <span 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            <button type="submit" className="admin-login-btn">Login</button>
          </form>
          <button className="back-btn" onClick={onBack}>← Back to Test</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">IPC Church Test - Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="export-btn" onClick={exportDetailedCSV}>
            📊 Export Detailed CSV
          </button>
          <button className="refresh-btn" onClick={loadResults}>
            🔄 Refresh Data
          </button>
          <button className="clear-btn" onClick={clearAllResults}>
            🗑️ Clear All Data
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
              ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(2)
              : '0.00'}
            /{results[0]?.totalQuestions || 0}
          </p>
        </div>
        <div className="stat-card">
          <h3>Highest Score</h3>
          <p className="stat-number">
            {results.length > 0 ? Math.max(...results.map(r => r.score)) : 0}
            /{results[0]?.totalQuestions || 0}
          </p>
        </div>
      </div>

      {results.length > 0 && (
        <div className="winners-section">
          <h2 className="winners-title">🏆 Top 3 Winners</h2>
          <div className="winners-grid">
            {rankedResults.slice(0, 3).map((winner, index) => (
              <div key={index} className={`winner-card ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}>
                <span className="winner-rank">{index + 1}</span>
                <div className="winner-info">
                  <p className="winner-name">{winner.userName}</p>
                  <p className="winner-phone">{winner.userPhone}</p>
                  <p className="winner-score">Score: {winner.score}/{winner.totalQuestions} ({winner.percentage.toFixed(2)}%)</p>
                  <p className="winner-time">Time: {winner.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-section">
        <h2 className="results-title">All Test Results ({results.length})</h2>
        {results.length === 0 ? (
          <div className="no-results">
            <h3>No test results yet</h3>
            <p>Results will appear here once users complete the test.</p>
          </div>
        ) : (
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
                {rankedResults.map((result) => (
                  <tr key={result.timestamp + result.userName} className={result.rank <= 3 ? 'top-three' : ''}>
                    <td className="rank-cell">
                      {result.rank}
                      {result.rank === 1 && ' 🥇'}
                      {result.rank === 2 && ' 🥈'}
                      {result.rank === 3 && ' 🥉'}
                    </td>
                    <td className="name-cell">{result.userName}</td>
                    <td className="phone-cell">{result.userPhone}</td>
                    <td className="score-cell">{result.score}/{result.totalQuestions}</td>
                    <td className="percentage-cell">{result.percentage.toFixed(2)}%</td>
                    <td className="timestamp-cell">{result.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
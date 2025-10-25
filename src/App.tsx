import React, { useState, useEffect } from 'react';
import './App.css';
import questionsData from './data/questions.json';

type AppState = 'landing' | 'nameInput' | 'test' | 'success';

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Shuffle array function
  const shuffleArray = (array: Question[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load questions on component mount
  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionsData);
    setQuestions(shuffledQuestions);
    console.log('🔄 Questions shuffled for new user - First 5 IDs:', shuffledQuestions.slice(0, 5).map(q => q.id));
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentState === 'test' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleTestComplete();
    }
  }, [timeRemaining, currentState]);

  const handleStartTest = () => {
    setCurrentState('nameInput');
  };

  const handleNamePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userPhone.trim()) {
      setCurrentState('test');
    } else {
      alert('Please enter both name and phone number');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const currentQuestionIndex = Object.keys(answers).length;
      const currentQuestion = questions[currentQuestionIndex];
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }));
      
      setSelectedAnswer('');
      
      if (currentQuestionIndex === questions.length - 1) {
        handleTestComplete();
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleTestComplete = () => {
    const score = calculateScore();
    const totalQuestions = questions.length;
    
    // Save results to localStorage (since no backend)
    const testResult = {
      userName,
      userPhone,
      score,
      totalQuestions,
      answers,
      timestamp: new Date().toLocaleString()
    };
    
    // Store in localStorage
    const existingResults = JSON.parse(localStorage.getItem('churchTestResults') || '[]');
    existingResults.push(testResult);
    localStorage.setItem('churchTestResults', JSON.stringify(existingResults));
    
    console.log('📝 Test completed:', testResult);
    setCurrentState('success');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestionIndex = Object.keys(answers).length;
  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();

  if (currentState === 'landing') {
    return (
      <div className="app">
        <div className="landing-page">
          <div className="landing-container">
            <h1 className="landing-title">IPC Bethel Church</h1>
            <p className="landing-subtitle">Digital One Mark Test</p>
            <button className="start-button" onClick={handleStartTest}>
              START TEST
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentState === 'nameInput') {
    return (
      <div className="app">
        <div className="name-input-container">
          <div className="name-input-content">
            <h2 className="input-title">Enter Your Details</h2>
            <p className="input-subtitle">Please provide your information to start the test</p>
            
            <div className="input-group">
              <label htmlFor="name" className="input-label">Name</label>
              <input
                type="text"
                id="name"
                className="text-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="phone" className="input-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="text-input"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <button className="start-button" onClick={handleNamePhoneSubmit}>
              START TEST
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentState === 'test') {
    return (
      <div className="app">
        <div className="test-container">
          <div className="question-header">
            <h2>QUESTION {currentQuestionIndex + 1}</h2>
            <div className={`timer ${timeRemaining < 300 ? 'timer-warning' : ''}`}>
              Time Remaining: {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="question-content">
            <p className="question-text">
              {currentQuestion?.question}
            </p>
            
            <div className="options-grid">
              {Object.entries(currentQuestion?.options || {}).map(([key, value]) => (
                <button 
                  key={key}
                  className={`option-button ${selectedAnswer === key ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(key)}
                >
                  {key}. {String(value)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button 
              className="nav-button next-button" 
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex === questions.length - 1 ? 'SUBMIT' : 'NEXT'}
            </button>
          </div>
          
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>
    );
  }

  if (currentState === 'success') {
    return (
      <div className="app">
        <div className="success-container">
          <div className="success-content">
            <h1 className="success-title">THANK YOU!</h1>
            <p className="success-message">Your answers have been saved successfully.</p>
            <p className="score-text">Your Score: {score}/{questions.length}</p>
            <button 
              className="restart-button"
              onClick={() => {
                setCurrentState('landing');
                setUserName('');
                setUserPhone('');
                setAnswers({});
                setTimeRemaining(15 * 60);
                setSelectedAnswer('');
              }}
            >
              TAKE TEST AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
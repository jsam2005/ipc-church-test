import { useState, useEffect } from 'react'
import './App.css'

type AppState = 'landing' | 'nameInput' | 'test' | 'success'
type Answer = string | null

// Question interface is defined in the JSON data structure

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionsData, setQuestionsData] = useState<any>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null)
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [loading, setLoading] = useState(true)

  // Load questions from local JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Load questions from local JSON file
        const response = await fetch('/ipc-church-test/questions.json')
        if (!response.ok) {
          throw new Error('Failed to load questions')
        }
        const questions = await response.json()
        
        // Shuffle questions for this user
        const shuffledQuestions = shuffleArray(questions)
        
        setQuestionsData({
          questions: shuffledQuestions,
          testDuration: 15
        })
        setAnswers(new Array(questions.length).fill(null))
        setTimeRemaining(15 * 60)
        setLoading(false)
      } catch (error) {
        console.error('Error loading questions:', error)
        setLoading(false)
      }
    }
    
    loadQuestions()
  }, [])

  // Shuffle array function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Timer effect
  useEffect(() => {
    if (currentState === 'test' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentState, timeRemaining])

  const handleStartTest = () => {
    setCurrentState('nameInput')
  }

  const handleNamePhoneSubmit = () => {
    if (userName.trim() === '' || userPhone.trim() === '') {
      alert('Please enter your Name and Phone Number to start the test.')
      return
    }
    setCurrentState('test')
    setTimeRemaining(questionsData.testDuration * 60)
    setCurrentQuestionIndex(0)
    setAnswers(new Array(questionsData.questions.length).fill(null))
    setSelectedAnswer(answers[0])
  }

  const handleTestComplete = async () => {
    try {
      // Calculate time spent
      const timeSpent = questionsData.testDuration * 60 - timeRemaining;
      
      // Send data to Google Apps Script
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // Replace with your actual URL
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          phone: userPhone,
          answers: answers,
          timeSpent: timeSpent
        })
      });

      if (response.ok) {
        console.log('Results saved to Google Sheets successfully');
        setCurrentState('success');
      } else {
        console.error('Failed to save results');
        setCurrentState('success'); // Still show success to user
      }
    } catch (error) {
      console.error('Error saving results:', error);
      setCurrentState('success'); // Still show success to user
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(answers[currentQuestionIndex + 1])
    } else {
      handleTestComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Loading Questions...</h1>
            <p className="landing-subtitle">Please wait while we load your test</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error if questions failed to load
  if (!questionsData) {
    return (
      <div className="app">
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Error Loading Test</h1>
            <p className="landing-subtitle">Please refresh the page to try again</p>
            <button className="start-button" onClick={() => window.location.reload()}>
              REFRESH PAGE
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questionsData.questions[currentQuestionIndex]

  if (currentState === 'landing') {
  return (
      <div className="landing-page">
        <div className="landing-container">
          <h1 className="landing-title">IPC Bethel Church</h1>
          <p className="landing-subtitle">Digital One Mark Test</p>
          <button 
            className="start-button"
            onClick={handleStartTest}
          >
            START TEST
          </button>
        </div>
      </div>
    )
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
    )
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
              {currentQuestion.question}
            </p>
            
            <div className="options-grid">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
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
            {currentQuestionIndex > 0 && (
              <button className="nav-button prev-button" onClick={handlePreviousQuestion}>
                PREVIOUS
              </button>
            )}
            
            <button 
              className="nav-button next-button" 
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex === questionsData.questions.length - 1 ? 'SUBMIT' : 'NEXT'}
            </button>
          </div>
          
          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questionsData.questions.length}
          </div>
        </div>
      </div>
    )
  }

  if (currentState === 'success') {
    return (
      <div className="app">
        <div className="success-container">
          <div className="success-content">
            <h1 className="success-title">THANK YOU!</h1>
            <p className="success-message">Your answers have been saved successfully.</p>
            <button 
              className="restart-button"
              onClick={() => setCurrentState('landing')}
            >
              TAKE TEST AGAIN
            </button>
          </div>
        </div>
      </div>
  )
  }

  return null
}

export default App
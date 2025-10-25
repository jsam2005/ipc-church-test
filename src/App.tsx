import { useState, useEffect } from 'react'
import './App.css'
import AdminPanel from './AdminPanel'

type AppState = 'landing' | 'nameInput' | 'test' | 'success' | 'admin'
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

  // Load questions and restore test state
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Always start with landing page, don't auto-restore test state
        setCurrentState('landing')
        
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

  // Save test state to localStorage
  const saveTestState = () => {
    if (currentState === 'test' || currentState === 'nameInput') {
      const testState = {
        currentState,
        currentQuestionIndex,
        answers,
        timeRemaining,
        userName,
        userPhone,
        questionsData
      }
      localStorage.setItem('churchTestInProgress', JSON.stringify(testState))
      console.log('💾 Test state saved:', testState)
    }
  }

  // Clear test state from localStorage
  const clearTestState = () => {
    localStorage.removeItem('churchTestInProgress')
    console.log('🗑️ Test state cleared')
  }

  // Save test state when important changes occur (not every second)
  useEffect(() => {
    // Only save when state, question, or answers change (not every timer tick)
    if (currentState === 'test' || currentState === 'nameInput') {
      saveTestState()
    }
  }, [currentState, currentQuestionIndex, answers, userName, userPhone])

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

      // Save state every 30 seconds during the test
      const saveInterval = setInterval(() => {
        if (currentState === 'test') {
          saveTestState()
        }
      }, 30000)

      return () => {
        clearInterval(timer)
        clearInterval(saveInterval)
      }
    }
  }, [currentState, timeRemaining])

  const handleStartTest = () => {
    // Check if there's a saved test in progress
    const savedTestState = localStorage.getItem('churchTestInProgress')
    
    if (savedTestState) {
      const testState = JSON.parse(savedTestState)
      console.log('🔄 Found saved test state:', testState)
      
      // Ask user if they want to continue
      const shouldContinue = confirm(
        `You have a test in progress (Question ${testState.currentQuestionIndex + 1} of ${testState.questionsData.questions.length}).\n\nDo you want to continue where you left off?`
      )
      
      if (shouldContinue) {
        // Restore the saved state
        setCurrentState(testState.currentState)
        setCurrentQuestionIndex(testState.currentQuestionIndex)
        setAnswers(testState.answers)
        setTimeRemaining(testState.timeRemaining)
        setUserName(testState.userName)
        setUserPhone(testState.userPhone)
        setQuestionsData(testState.questionsData)
        setSelectedAnswer(testState.answers[testState.currentQuestionIndex])
        return
      } else {
        // Clear the saved state and start fresh
        clearTestState()
      }
    }
    
    // Start fresh test
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
      // Calculate score - fix the comparison logic
      let score = 0;
      const detailedAnswers: any[] = [];
      
      questionsData.questions.forEach((question: any, index: number) => {
        const userAnswer = answers[index];
        const correctAnswerText = question.correctAnswer;
        
        // Find which option (A, B, C, D) corresponds to the correct answer text
        let correctOption = null;
        Object.entries(question.options).forEach(([key, value]) => {
          if (value === correctAnswerText) {
            correctOption = key;
          }
        });
        
        // Check if user's answer matches the correct option
        const isCorrect = userAnswer === correctOption;
        if (isCorrect) {
          score++;
        }
        
        // Store detailed answer for CSV
        detailedAnswers.push({
          questionNumber: index + 1,
          questionText: question.question,
          userAnswer: userAnswer,
          userAnswerText: userAnswer ? question.options[userAnswer] : 'Not answered',
          correctAnswer: correctOption,
          correctAnswerText: correctAnswerText,
          isCorrect: isCorrect,
          // Store all options for reference
          optionA: question.options.A,
          optionB: question.options.B,
          optionC: question.options.C,
          optionD: question.options.D
        });
        
        console.log(`Question ${index + 1}: User=${userAnswer}, Correct=${correctOption}, Match=${isCorrect}`);
      });
      
      // Save results to localStorage with detailed answers
      const testResult = {
        userName,
        userPhone,
        score,
        totalQuestions: questionsData.questions.length,
        answers,
        detailedAnswers,
        timestamp: new Date().toLocaleString()
      };
      
      // Store in localStorage
      const existingResults = JSON.parse(localStorage.getItem('churchTestResults') || '[]');
      existingResults.push(testResult);
      localStorage.setItem('churchTestResults', JSON.stringify(existingResults));
      
      // Clear the test in progress state
      clearTestState();
      
      console.log('📝 Test completed and saved locally:', testResult);
      console.log(`🎯 Final Score: ${score}/${questionsData.questions.length}`);
      setCurrentState('success');
      
    } catch (error) {
      console.error('Error saving results:', error);
      clearTestState();
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
          <button 
            className="admin-button"
            onClick={() => setCurrentState('admin')}
          >
            🔐 ADMIN PANEL
          </button>
          {localStorage.getItem('churchTestInProgress') && (
            <div className="test-warning">
              <p>⚠️ You have a test in progress. Refreshing will continue from where you left off.</p>
              <button 
                className="clear-test-button"
                onClick={() => {
                  clearTestState();
                  window.location.reload();
                }}
              >
                Start Fresh Test
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentState === 'admin') {
    return <AdminPanel onBack={() => setCurrentState('landing')} />
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
            
            <div className="button-group">
              <button className="back-button" onClick={() => setCurrentState('landing')}>
                ← BACK
              </button>
              <button className="start-button" onClick={handleNamePhoneSubmit}>
                START TEST
              </button>
            </div>
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
            <div className="header-top">
              <button className="back-to-home" onClick={() => setCurrentState('landing')}>
                ← HOME
        </button>
              <h2>QUESTION {currentQuestionIndex + 1}</h2>
              <div className={`timer ${timeRemaining < 300 ? 'timer-warning' : ''}`}>
                Time Remaining: {formatTime(timeRemaining)}
              </div>
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
            <div className="success-buttons">
              <button 
                className="back-button"
                onClick={() => setCurrentState('landing')}
              >
                ← BACK TO HOME
              </button>
              <button 
                className="restart-button"
                onClick={() => {
                  clearTestState();
                  setCurrentState('landing');
                }}
              >
                TAKE TEST AGAIN
              </button>
            </div>
          </div>
        </div>
      </div>
  )
  }

  return null
}

export default App
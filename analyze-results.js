import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SPREADSHEET_ID = '1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4';
const RANGE = 'Sheet1!A:Z';

// Load questions to get correct answers
async function loadQuestionsFromCSV() {
  return new Promise((resolve, reject) => {
    const questions = [];
    
    fs.createReadStream(path.join(__dirname, 'Question.csv'))
      .pipe(csv())
      .on('data', (row) => {
        questions.push({
          id: parseInt(row['Question Number']),
          question: row['Question'],
          options: {
            A: row['Option A'],
            B: row['Option B'],
            C: row['Option C'],
            D: row['Option D']
          },
          correctAnswer: row['Correct Answer']
        });
      })
      .on('end', () => {
        resolve(questions);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Initialize Google Sheets
async function getGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Calculate score for a participant
function calculateScore(answers, questions) {
  let score = 0;
  let totalQuestions = questions.length;
  
  // Create a map of question ID to question for quick lookup
  const questionMap = new Map();
  questions.forEach(q => {
    questionMap.set(q.id, q);
  });
  
  for (let i = 0; i < answers.length && i < totalQuestions; i++) {
    const userAnswer = answers[i]; // A, B, C, or D
    const question = questions[i]; // This is the shuffled question
    
    if (!question || !question.options || !question.correctAnswer) {
      console.log(`⚠️  Question ${i+1} data missing`);
      continue;
    }
    
    const correctAnswer = question.correctAnswer; // Tamil answer
    
    // Get the option that matches the correct Tamil answer
    const correctOption = Object.keys(question.options).find(key => 
      question.options[key] === correctAnswer
    );
    
    if (userAnswer === correctOption) {
      score++;
    }
  }
  
  return {
    score: score,
    total: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100)
  };
}

// Analyze results and find winner
async function analyzeResults() {
  try {
    console.log('🔍 Analyzing Church Test Results...\n');
    
    // Load questions to get correct answers
    const questions = await loadQuestionsFromCSV();
    console.log(`📚 Loaded ${questions.length} questions from CSV`);
    
    // Get data from Google Sheets
    const sheets = await getGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.log('❌ No test results found in the sheet.');
      return;
    }
    
    // Skip header row
    const results = rows.slice(1);
    
    console.log(`📊 Found ${results.length} test results\n`);
    
    // Analyze each result
    const analyzedResults = [];
    
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      const timestamp = row[0] || 'Unknown';
      const name = row[1] || 'Unknown';
      const phone = row[2] || 'Unknown';
      const timeSpent = parseInt(row[3]) || 0;
      
      // Get answers (columns 4 onwards)
      const answers = row.slice(4);
      
      const scoreData = calculateScore(answers, questions);
      
      analyzedResults.push({
        rank: i + 1,
        name: name,
        phone: phone,
        timestamp: timestamp,
        timeSpent: timeSpent,
        score: scoreData.score,
        total: scoreData.total,
        percentage: scoreData.percentage,
        answers: answers
      });
    }
    
    // Sort by score (highest first), then by time (fastest first)
    analyzedResults.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.timeSpent - b.timeSpent; // Faster time first
    });
    
    // Update ranks
    analyzedResults.forEach((result, index) => {
      result.rank = index + 1;
    });
    
    // Display results
    console.log('🏆 CHURCH TEST RESULTS - RANKINGS\n');
    console.log('=' .repeat(80));
    console.log('Rank | Name           | Phone        | Score | %   | Time | Timestamp');
    console.log('-' .repeat(80));
    
    analyzedResults.forEach(result => {
      const name = result.name.padEnd(15).substring(0, 15);
      const phone = result.phone.padEnd(12).substring(0, 12);
      const score = `${result.score}/${result.total}`.padStart(5);
      const percentage = `${result.percentage}%`.padStart(4);
      const time = `${Math.floor(result.timeSpent/60)}:${(result.timeSpent%60).toString().padStart(2,'0')}`.padStart(5);
      const timestamp = result.timestamp.substring(0, 16);
      
      console.log(`${result.rank.toString().padStart(4)} | ${name} | ${phone} | ${score} | ${percentage} | ${time} | ${timestamp}`);
    });
    
    console.log('\n' + '=' .repeat(80));
    
    // Find winner
    const winner = analyzedResults[0];
    console.log('\n🎉 WINNER:');
    console.log(`👑 ${winner.name} (${winner.phone})`);
    console.log(`📊 Score: ${winner.score}/${winner.total} (${winner.percentage}%)`);
    console.log(`⏱️  Time: ${Math.floor(winner.timeSpent/60)}:${(winner.timeSpent%60).toString().padStart(2,'0')}`);
    console.log(`📅 Completed: ${winner.timestamp}`);
    
    // Show top 3
    console.log('\n🏅 TOP 3:');
    analyzedResults.slice(0, 3).forEach((result, index) => {
      const medal = ['🥇', '🥈', '🥉'][index];
      console.log(`${medal} ${result.rank}. ${result.name} - ${result.score}/${result.total} (${result.percentage}%)`);
    });
    
    // Statistics
    const totalParticipants = analyzedResults.length;
    const averageScore = Math.round(analyzedResults.reduce((sum, r) => sum + r.score, 0) / totalParticipants);
    const averagePercentage = Math.round(analyzedResults.reduce((sum, r) => sum + r.percentage, 0) / totalParticipants);
    
    console.log('\n📈 STATISTICS:');
    console.log(`👥 Total Participants: ${totalParticipants}`);
    console.log(`📊 Average Score: ${averageScore}/${questions.length} (${averagePercentage}%)`);
    console.log(`🏆 Highest Score: ${Math.max(...analyzedResults.map(r => r.score))}/${questions.length}`);
    console.log(`⚡ Fastest Time: ${Math.floor(Math.min(...analyzedResults.map(r => r.timeSpent))/60)}:${(Math.min(...analyzedResults.map(r => r.timeSpent))%60).toString().padStart(2,'0')}`);
    
  } catch (error) {
    console.error('❌ Error analyzing results:', error.message);
  }
}

// Run the analysis
analyzeResults();

import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4';
const RANGE = 'Sheet1!A:Z';

// Load questions from CSV
async function loadQuestionsFromCSV() {
  return new Promise((resolve, reject) => {
    const questions = [];
    
    fs.createReadStream(path.join(__dirname, '../../Question.csv'))
      .pipe(csv())
      .on('data', (row) => {
        if (row['Question Number'] && row['Question']) {
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
        }
      })
      .on('end', () => {
        resolve(questions);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize Google Sheets API
async function getGoogleSheets() {
  try {
    const requiredEnvVars = [
      'GOOGLE_TYPE', 'GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY_ID', 
      'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_CLIENT_ID',
      'GOOGLE_AUTH_URI', 'GOOGLE_TOKEN_URI', 'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
      'GOOGLE_CLIENT_X509_CERT_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('⚠️  Google Sheets environment variables not found. Google Sheets integration disabled.');
      return null;
    }

    const credentials = {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
    };

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return null;
  }
}

// API Routes
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await loadQuestionsFromCSV();
    const shuffledQuestions = shuffleArray(questions);
    
    console.log('🔄 Questions shuffled for new user - First 5 IDs:', shuffledQuestions.slice(0, 5).map(q => q.id));
    
    res.json({
      questions: shuffledQuestions,
      testDuration: 15
    });
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

app.post('/api/save-results', async (req, res) => {
  try {
    const { userName, userPhone, answers, score, totalQuestions } = req.body;
    
    const sheets = await getGoogleSheets();
    
    if (!sheets) {
      console.log('📝 Google Sheets not available. Logging results to console:');
      console.log(`Name: ${userName}, Phone: ${userPhone}, Score: ${score}/${totalQuestions}`);
      return res.json({ success: true, message: 'Results logged to console' });
    }

    const values = [
      [
        new Date().toLocaleString(),
        userName,
        userPhone,
        score,
        totalQuestions,
        `${score}/${totalQuestions}`,
        JSON.stringify(answers)
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      requestBody: { values }
    });

    console.log(`✅ Results saved to Google Sheets for ${userName}`);
    res.json({ success: true, message: 'Results saved successfully' });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ error: 'Failed to save results' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Handle all other routes for React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

export default app;

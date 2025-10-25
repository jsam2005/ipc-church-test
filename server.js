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
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4';
const RANGE = 'Sheet1!A:Z'; // Adjust range as needed

// Load questions from CSV
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
        // Shuffle questions for each user
        const shuffledQuestions = shuffleArray([...questions]);
        
        resolve({
          questions: shuffledQuestions,
          testDuration: 15 // 15 minutes
        });
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
    // Check if environment variables are set
    const requiredEnvVars = [
      'GOOGLE_TYPE', 'GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY_ID', 
      'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_CLIENT_ID',
      'GOOGLE_AUTH_URI', 'GOOGLE_TOKEN_URI', 'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
      'GOOGLE_CLIENT_X509_CERT_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('⚠️  Google Sheets environment variables not found. Google Sheets integration disabled.');
      console.log('📖 Set the following environment variables:');
      console.log(missingVars.join(', '));
      return null;
    }

    // Create credentials object from environment variables
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

// API endpoint to get questions (shuffled for each request)
app.get('/api/questions', async (req, res) => {
  try {
    const questionsData = await loadQuestionsFromCSV();
    console.log(`🔄 Questions shuffled for new user - First 5 IDs: ${questionsData.questions.slice(0, 5).map(q => q.id).join(', ')}`);
    res.json(questionsData);
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// API endpoint to save test results
app.post('/api/save-results', async (req, res) => {
  try {
    const { name, phone, answers, timeSpent } = req.body;
    
    const sheets = await getGoogleSheets();
    if (!sheets) {
      // Log the data locally when Google Sheets is not configured
      console.log('📊 Test Results (Google Sheets not configured):');
      console.log('Name:', name);
      console.log('Phone:', phone);
      console.log('Time Spent:', timeSpent, 'seconds');
      console.log('Answers:', answers);
      console.log('---');
      
      return res.json({ 
        success: true, 
        message: 'Results logged locally (Google Sheets not configured)' 
      });
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toLocaleString();
    const rowData = [
      timestamp,
      name,
      phone,
      timeSpent,
      ...answers.map(answer => answer || 'No Answer')
    ];

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      resource: {
        values: [rowData]
      }
    });

    console.log('Data saved to Google Sheets:', response.data);
    res.json({ success: true, message: 'Results saved successfully' });

  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to save results' });
  }
});

// Serve React app for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle all other routes for React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/save-results`);
  });
}

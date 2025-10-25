import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4';

async function checkData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:Z',
    });
    
    console.log('📊 Google Sheets Data:');
    console.log('====================');
    
    response.data.values.forEach((row, index) => {
      console.log(`Row ${index}:`, row);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();

import fs from 'fs';
import path from 'path';

console.log('🚀 Church Test Setup Guide');
console.log('========================\n');

console.log('📋 To connect with Google Sheets, follow these steps:\n');

console.log('1️⃣  Create Google Cloud Project:');
console.log('   - Go to: https://console.cloud.google.com/');
console.log('   - Create new project or select existing');
console.log('   - Enable Google Sheets API\n');

console.log('2️⃣  Create Service Account:');
console.log('   - Go to APIs & Services > Credentials');
console.log('   - Create Credentials > Service Account');
console.log('   - Name: church-test-service\n');

console.log('3️⃣  Download Credentials:');
console.log('   - Click on service account email');
console.log('   - Go to Keys tab > Add Key > Create new key');
console.log('   - Choose JSON format');
console.log('   - Download and rename to "credentials.json"');
console.log('   - Place in this project folder\n');

console.log('4️⃣  Create Google Sheet:');
console.log('   - Go to: https://sheets.google.com/');
console.log('   - Create new sheet named "Church Test Results"');
console.log('   - Add headers: Timestamp, Name, Phone, Time Spent, Question 1, Question 2, etc.\n');

console.log('5️⃣  Share Sheet:');
console.log('   - Click Share button in your Google Sheet');
console.log('   - Add service account email (from credentials.json)');
console.log('   - Give Editor permissions\n');

console.log('6️⃣  Update Configuration:');
console.log('   - Copy Sheet ID from URL');
console.log('   - Update server.js with your Sheet ID\n');

console.log('7️⃣  Run the Application:');
console.log('   - npm run build');
console.log('   - npm run server');
console.log('   - Open: http://localhost:3001\n');

console.log('📖 For detailed instructions, see: GOOGLE_SHEETS_SETUP.md\n');

// Check if credentials.json exists
if (fs.existsSync('credentials.json')) {
  console.log('✅ credentials.json found!');
} else {
  console.log('❌ credentials.json not found. Please follow step 3 above.');
}

// Check if dist folder exists
if (fs.existsSync('dist')) {
  console.log('✅ Build folder found!');
} else {
  console.log('⚠️  Build folder not found. Run "npm run build" first.');
}

console.log('\n🎉 Setup complete! Your church test is ready to use.');

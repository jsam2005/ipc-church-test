import fs from 'fs';
import path from 'path';

console.log('🚀 Railway Deployment Setup for IPC Church Test');
console.log('================================================\n');

// Check if credentials.json exists
const credentialsPath = 'credentials.json';
if (!fs.existsSync(credentialsPath)) {
  console.log('❌ credentials.json not found!');
  console.log('📋 Please follow these steps:');
  console.log('1. Go to Google Cloud Console');
  console.log('2. Create a Service Account');
  console.log('3. Download the JSON key file');
  console.log('4. Save it as "credentials.json" in this folder');
  console.log('5. Run this script again\n');
  process.exit(1);
}

try {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  
  console.log('✅ credentials.json found!');
  console.log('\n📋 Railway Environment Variables:');
  console.log('=====================================');
  console.log('Copy these to your Railway project variables:');
  console.log('');
  
  console.log('GOOGLE_SHEETS_PRIVATE_KEY=');
  console.log(`"${credentials.private_key}"`);
  console.log('');
  
  console.log('GOOGLE_SHEETS_CLIENT_EMAIL=');
  console.log(`"${credentials.client_email}"`);
  console.log('');
  
  console.log('GOOGLE_SHEETS_SHEET_ID=');
  console.log('"1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4"');
  console.log('');
  
  console.log('🔗 Next Steps:');
  console.log('1. Go to railway.app');
  console.log('2. Create new project from GitHub');
  console.log('3. Select your repository: jsam2005/ipc-church-test');
  console.log('4. Add the environment variables above');
  console.log('5. Deploy!');
  console.log('');
  console.log('📱 Your church members can then access the test at your Railway URL!');
  
} catch (error) {
  console.log('❌ Error reading credentials.json:', error.message);
  console.log('Please make sure the file is valid JSON format');
}

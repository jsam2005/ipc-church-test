import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Converting credentials.json to Environment Variables');
console.log('======================================================\n');

try {
  // Read credentials.json
  const credentialsPath = path.join(__dirname, 'credentials.json');
  
  if (!fs.existsSync(credentialsPath)) {
    console.log('❌ credentials.json not found!');
    console.log('📖 Please make sure credentials.json exists in the project root.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  
  console.log('✅ Found credentials.json');
  console.log('📋 Converting to environment variables...\n');

  // Create .env content
  const envContent = `# Google Sheets Environment Variables
# Generated from credentials.json

# Google Sheet ID
GOOGLE_SHEET_ID=1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4

# Google Service Account Credentials
GOOGLE_TYPE=${credentials.type}
GOOGLE_PROJECT_ID=${credentials.project_id}
GOOGLE_PRIVATE_KEY_ID=${credentials.private_key_id}
GOOGLE_PRIVATE_KEY="${credentials.private_key}"
GOOGLE_CLIENT_EMAIL=${credentials.client_email}
GOOGLE_CLIENT_ID=${credentials.client_id}
GOOGLE_AUTH_URI=${credentials.auth_uri}
GOOGLE_TOKEN_URI=${credentials.token_uri}
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=${credentials.auth_provider_x509_cert_url}
GOOGLE_CLIENT_X509_CERT_URL=${credentials.client_x509_cert_url}`;

  // Write .env file
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Successfully created .env file!');
  console.log('📁 Location: .env');
  console.log('\n📋 Environment Variables Created:');
  console.log('================================');
  console.log(`GOOGLE_SHEET_ID=${credentials.project_id ? '1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4' : 'NOT_SET'}`);
  console.log(`GOOGLE_TYPE=${credentials.type || 'NOT_SET'}`);
  console.log(`GOOGLE_PROJECT_ID=${credentials.project_id || 'NOT_SET'}`);
  console.log(`GOOGLE_PRIVATE_KEY_ID=${credentials.private_key_id || 'NOT_SET'}`);
  console.log(`GOOGLE_PRIVATE_KEY=${credentials.private_key ? 'SET' : 'NOT_SET'}`);
  console.log(`GOOGLE_CLIENT_EMAIL=${credentials.client_email || 'NOT_SET'}`);
  console.log(`GOOGLE_CLIENT_ID=${credentials.client_id || 'NOT_SET'}`);
  console.log(`GOOGLE_AUTH_URI=${credentials.auth_uri || 'NOT_SET'}`);
  console.log(`GOOGLE_TOKEN_URI=${credentials.token_uri || 'NOT_SET'}`);
  console.log(`GOOGLE_AUTH_PROVIDER_X509_CERT_URL=${credentials.auth_provider_x509_cert_url || 'NOT_SET'}`);
  console.log(`GOOGLE_CLIENT_X509_CERT_URL=${credentials.client_x509_cert_url || 'NOT_SET'}`);
  
  console.log('\n🚀 Ready for Deployment!');
  console.log('========================');
  console.log('1. Copy the values from .env file');
  console.log('2. Set them in your hosting platform (Vercel/Netlify/Railway)');
  console.log('3. Deploy your church test!');
  console.log('\n📖 For detailed instructions, see: ENVIRONMENT_SETUP.md');

} catch (error) {
  console.error('❌ Error converting credentials:', error.message);
  console.log('\n📖 Please check your credentials.json file format.');
}

# Environment Variables Setup for Deployment

## 🔧 **Convert credentials.json to Environment Variables**

### **Step 1: Get Your credentials.json Values**
Open your `credentials.json` file and copy these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id", 
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
}
```

### **Step 2: Set Environment Variables**

#### **For Vercel:**
1. Go to your project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

| Variable Name | Value from credentials.json |
|---------------|----------------------------|
| `GOOGLE_SHEET_ID` | `1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4` |
| `GOOGLE_TYPE` | `service_account` |
| `GOOGLE_PROJECT_ID` | Copy from `project_id` |
| `GOOGLE_PRIVATE_KEY_ID` | Copy from `private_key_id` |
| `GOOGLE_PRIVATE_KEY` | Copy from `private_key` (keep the quotes) |
| `GOOGLE_CLIENT_EMAIL` | Copy from `client_email` |
| `GOOGLE_CLIENT_ID` | Copy from `client_id` |
| `GOOGLE_AUTH_URI` | Copy from `auth_uri` |
| `GOOGLE_TOKEN_URI` | Copy from `token_uri` |
| `GOOGLE_AUTH_PROVIDER_X509_CERT_URL` | Copy from `auth_provider_x509_cert_url` |
| `GOOGLE_CLIENT_X509_CERT_URL` | Copy from `client_x509_cert_url` |

#### **For Netlify:**
1. Go to **"Site settings"** → **"Environment variables"**
2. Add the same variables as above

#### **For Railway:**
1. Go to your project dashboard
2. Click **"Variables"** tab
3. Add the same variables as above

### **Step 3: Important Notes**

#### **GOOGLE_PRIVATE_KEY:**
- **Keep the quotes** around the private key
- **Keep the newlines** (`\n`) in the key
- Example: `"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"`

#### **GOOGLE_SHEET_ID:**
- This is your Google Sheet ID: `1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4`

### **Step 4: Test Your Deployment**
After setting all environment variables:
1. **Deploy your project**
2. **Check the logs** for any missing variables
3. **Test the test submission** to ensure Google Sheets integration works

## ✅ **Summary**
- **11 environment variables** total
- **Copy values** from your `credentials.json`
- **Keep quotes** around `GOOGLE_PRIVATE_KEY`
- **Deploy and test** your church test

Your church test will now work on the internet with Google Sheets integration! 🎉

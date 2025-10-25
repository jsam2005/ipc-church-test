# Deploy IPC Church Test to Railway (FREE with Google Sheets)

## Why Railway?
- ✅ **FREE** - No payment method required
- ✅ **Node.js Support** - Full backend with Google Sheets integration
- ✅ **Easy Setup** - Connect GitHub repository
- ✅ **Automatic Deployments** - Updates when you push to GitHub

## Step-by-Step Deployment:

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email

### 2. Deploy Your Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `jsam2005/ipc-church-test`
4. Railway will automatically detect it's a Node.js project

### 3. Set Environment Variables
1. Go to your project dashboard
2. Click on "Variables" tab
3. Add these environment variables:

```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SHEET_ID="1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4"
```

### 4. Get Your Google Sheets Credentials
If you don't have them yet, run this command locally:
```bash
npm run convert-env
```

This will create a `.env` file with your credentials. Copy the values to Railway.

### 5. Deploy
1. Railway will automatically build and deploy
2. You'll get a URL like: `https://your-app-name.railway.app`
3. Test the deployment!

## Benefits of Railway Deployment:
- ✅ **Google Sheets Integration** - Results saved to your spreadsheet
- ✅ **Question Shuffling** - Each user gets different question order
- ✅ **Timer Functionality** - 15-minute countdown
- ✅ **Mobile Optimized** - Works perfectly on phones
- ✅ **Multiple Users** - Unlimited concurrent users
- ✅ **Free Hosting** - No cost for basic usage

## Your Deployment URL:
Once deployed, you'll get a URL like:
`https://ipc-church-test-production.railway.app`

Share this URL with your church members!

## Troubleshooting:
- If deployment fails, check the Railway logs
- Make sure all environment variables are set correctly
- Ensure your Google Sheet has the service account email added as Editor

## Cost:
- **FREE** for basic usage (up to $5/month worth of usage)
- Perfect for church events with 30+ members

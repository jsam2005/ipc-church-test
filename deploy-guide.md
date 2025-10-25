# Deploy Church Test to Internet - Multiple Users Guide

## 🚀 Option 1: Vercel (Recommended - Free & Easy)

### Step 1: Prepare for Deployment
1. **Create GitHub Repository:**
   - Go to https://github.com
   - Create new repository: `ipc-church-test`
   - Upload all your files

### Step 2: Deploy to Vercel
1. **Go to Vercel:** https://vercel.com
2. **Sign up with GitHub**
3. **Import your repository**
4. **Deploy automatically** - Vercel will build and deploy
5. **Get your live URL** - like `https://ipc-church-test.vercel.app`

### Step 3: Configure Environment Variables
In Vercel dashboard, add:
- `GOOGLE_SHEET_ID` = your Google Sheet ID
- Upload `credentials.json` as environment variable

## 🌐 Option 2: Netlify (Alternative - Free)

### Step 1: Build for Production
```bash
npm run build
```

### Step 2: Deploy to Netlify
1. **Go to:** https://app.netlify.com/drop
2. **Drag and drop** your `dist` folder
3. **Get instant URL** - like `https://amazing-name-123456.netlify.app`

### Step 3: Add Backend (Netlify Functions)
- Create `netlify/functions/save-results.js`
- Add Google Sheets integration
- Deploy backend functions

## 📱 Option 3: Railway (Full Stack - Free Tier)

### Step 1: Prepare Project
```bash
# Add start script to package.json
"start": "node server.js"
```

### Step 2: Deploy to Railway
1. **Go to:** https://railway.app
2. **Connect GitHub repository**
3. **Deploy automatically**
4. **Get live URL** - like `https://ipc-church-test.railway.app`

## 🔧 Option 4: Render (Free Tier)

### Step 1: Create render.yaml
```yaml
services:
  - type: web
    name: ipc-church-test
    env: node
    buildCommand: npm install && npm run build
    startCommand: node server.js
    envVars:
      - key: GOOGLE_SHEET_ID
        value: your-sheet-id-here
```

### Step 2: Deploy
1. **Connect GitHub to Render**
2. **Auto-deploy from repository**
3. **Get live URL** - like `https://ipc-church-test.onrender.com`

## 📊 Current Setup Status

### ✅ What's Working:
- **Local server** - `http://localhost:3001`
- **Google Sheets integration** - saving results
- **Shuffled questions** - fair testing
- **Mobile optimized** - perfect for phones
- **Background image** - professional church branding

### 🎯 What You Need:
- **Internet deployment** - so anyone can access
- **Public URL** - share with church members
- **Google Sheets** - already configured ✅

## 🚀 Quick Start (Recommended)

**Use Vercel - it's the easiest:**

1. **Create GitHub account** (free)
2. **Upload your code** to GitHub
3. **Connect to Vercel** (free)
4. **Get live URL** in 5 minutes
5. **Share URL** with church members

**Result:** Church members can access from anywhere with their own WiFi/mobile data!

## 📱 For Church Members

Once deployed, church members will:
- **Access from anywhere** - their own WiFi/mobile data
- **Get shuffled questions** - fair testing
- **See results automatically** - saved to Google Sheets
- **Use on phones** - mobile optimized

## 🔒 Security Notes

- **Google Sheets credentials** - keep secure
- **Environment variables** - don't expose in code
- **HTTPS only** - secure connections
- **Rate limiting** - prevent abuse

## 📞 Support

If you need help with deployment:
1. **Vercel** - easiest for beginners
2. **Netlify** - good for static sites
3. **Railway** - full-stack applications
4. **Render** - reliable hosting

Choose the option that works best for you!

# Deploy IPC Church Test to Google Cloud Platform

## 🚀 **Google Cloud Platform Deployment Guide**

### **Why Google Cloud?**
- ✅ **Better for full-stack apps** - Node.js + React
- ✅ **More reliable** - No 404 routing issues
- ✅ **Google Sheets integration** - Native Google services
- ✅ **Free tier available** - $300 credit for new users
- ✅ **Easy deployment** - Simple commands

## 🛠️ **Deployment Options:**

### **Option 1: Google App Engine (Recommended)**
**Best for:** Full-stack Node.js applications

#### **Setup Steps:**
1. **Install Google Cloud CLI:**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   # Or use: gcloud init
   ```

2. **Create app.yaml:**
   ```yaml
   runtime: nodejs18
   env: standard
   instance_class: F1
   automatic_scaling:
     min_instances: 0
     max_instances: 10
   env_variables:
     GOOGLE_SHEET_ID: "1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4"
     GOOGLE_TYPE: "service_account"
     GOOGLE_PROJECT_ID: "gen-lang-client-0541124298"
     # ... add all your environment variables
   ```

3. **Deploy:**
   ```bash
   gcloud app deploy
   ```

### **Option 2: Google Cloud Run**
**Best for:** Containerized applications

#### **Setup Steps:**
1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["node", "server.js"]
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy ipc-church-test --source .
   ```

### **Option 3: Google Compute Engine**
**Best for:** Full control over server

#### **Setup Steps:**
1. **Create VM instance**
2. **Install Node.js**
3. **Clone your repository**
4. **Run your application**

## 🔧 **Quick Start (App Engine):**

### **Step 1: Create app.yaml**
```yaml
runtime: nodejs18
env: standard
instance_class: F1
automatic_scaling:
  min_instances: 0
  max_instances: 10
env_variables:
  GOOGLE_SHEET_ID: "1SuLE2EpE8bItFm6Md7i4BjNMD_CV4o5jVyj7xUpJ7G4"
  GOOGLE_TYPE: "service_account"
  GOOGLE_PROJECT_ID: "gen-lang-client-0541124298"
  GOOGLE_PRIVATE_KEY_ID: "d48a75bac96dfec522b0e5a8f395b93afe530896"
  GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
  GOOGLE_CLIENT_EMAIL: "church-test-service@gen-lang-client-0541124298.iam.gserviceaccount.com"
  GOOGLE_CLIENT_ID: "116623561556549941217"
  GOOGLE_AUTH_URI: "https://accounts.google.com/o/oauth2/auth"
  GOOGLE_TOKEN_URI: "https://oauth2.googleapis.com/token"
  GOOGLE_AUTH_PROVIDER_X509_CERT_URL: "https://www.googleapis.com/oauth2/v1/certs"
  GOOGLE_CLIENT_X509_CERT_URL: "https://www.googleapis.com/robot/v1/metadata/x509/church-test-service%40gen-lang-client-0541124298.iam.gserviceaccount.com"
```

### **Step 2: Deploy**
```bash
gcloud app deploy
```

### **Step 3: Get URL**
```bash
gcloud app browse
```

## 💰 **Pricing:**
- **App Engine F1:** Free tier available
- **Cloud Run:** Pay per request (very cheap)
- **Compute Engine:** $5-10/month for small instance

## 📱 **Benefits for Your Church Test:**
- ✅ **No routing issues** - Proper Node.js hosting
- ✅ **Google Sheets integration** - Native Google services
- ✅ **Reliable uptime** - Google infrastructure
- ✅ **Easy scaling** - Handle many church members
- ✅ **Free tier** - No cost for small usage

## 🎯 **Recommended: Google App Engine**
- **Easiest to set up**
- **Best for Node.js apps**
- **Free tier available**
- **No Docker required**

Would you like me to help you set up Google App Engine deployment?

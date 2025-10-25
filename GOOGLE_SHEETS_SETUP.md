# Google Sheets Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: `church-test-service`
   - Description: `Service account for church test app`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the JSON file
7. Rename it to `credentials.json` and place it in your project root

## Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new sheet
3. Name it "Church Test Results"
4. Add these headers in row 1:
   - A1: Timestamp
   - B1: Name
   - C1: Phone
   - D1: Time Spent (seconds)
   - E1: Question 1
   - F1: Question 2
   - G1: Question 3
   - H1: Question 4
   - I1: Question 5

## Step 5: Share Sheet with Service Account

1. Click "Share" button in your Google Sheet
2. Add the service account email (from credentials.json)
3. Give it "Editor" permissions
4. Copy the Sheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

## Step 6: Update Configuration

1. Open `server.js`
2. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Sheet ID
3. Place `credentials.json` in your project root

## Step 7: Test the Setup

1. Run the server: `node server.js`
2. Take the test and submit
3. Check your Google Sheet for the new data

## Troubleshooting

- Make sure `credentials.json` is in the project root
- Ensure the service account has access to the sheet
- Check that the Google Sheets API is enabled
- Verify the Sheet ID is correct

## Data Format

The data will be saved in this format:
- Column A: Timestamp (when test was completed)
- Column B: Name (from user input)
- Column C: Phone (from user input)
- Column D: Time Spent (in seconds)
- Columns E-I: Answers to questions 1-5 (A, B, C, or D)

# GitHub Pages + Google Sheets Integration (FREE)

## Solution: Use Google Apps Script as Backend

Since GitHub Pages only serves static files, we'll use Google Apps Script to create a web app that saves data to Google Sheets.

## Step 1: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with this:

```javascript
function doPost(e) {
  try {
    // Get the spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the data
    const data = JSON.parse(e.postData.contents);
    const { name, phone, answers, timeSpent } = data;
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Name', 'Phone', 'Answers', 'Time Spent', 'Timestamp']]);
    }
    
    // Add the data
    const timestamp = new Date();
    sheet.appendRow([name, phone, JSON.stringify(answers), timeSpent, timestamp]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Step 2: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the web app URL (looks like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 3: Update Your App

I'll modify the app to use the Google Apps Script URL instead of a local backend.

## Step 4: Deploy to GitHub Pages

The app will work on GitHub Pages and save data to your Google Sheet!

## Benefits:
- ✅ **FREE** - No hosting costs
- ✅ **Google Sheets Integration** - Data saved to your spreadsheet
- ✅ **Simple Setup** - No complex deployment
- ✅ **Reliable** - Google's infrastructure
- ✅ **Mobile Friendly** - Works on all devices

## Your Google Sheet:
Create a new Google Sheet and note the Sheet ID from the URL:
`https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

The Google Apps Script will automatically create columns:
- Name
- Phone  
- Answers (JSON)
- Time Spent
- Timestamp

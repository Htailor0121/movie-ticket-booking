#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to update API base URL
function updateApiUrl(newUrl) {
  const apiFilePath = path.join(__dirname, 'src', 'api', 'index.js');
  
  try {
    let content = fs.readFileSync(apiFilePath, 'utf8');
    
    // Replace the baseURL
    content = content.replace(
      /baseURL:\s*['"`][^'"`]*['"`]/,
      `baseURL: '${newUrl}'`
    );
    
    fs.writeFileSync(apiFilePath, content);
    console.log(`✅ Updated API base URL to: ${newUrl}`);
  } catch (error) {
    console.error('❌ Error updating API URL:', error.message);
  }
}

// Get URL from command line argument
const newUrl = process.argv[2];

if (!newUrl) {
  console.log('Usage: node update-api-url.js <your-backend-url>');
  console.log('Example: node update-api-url.js https://your-app.railway.app');
  process.exit(1);
}

updateApiUrl(newUrl); 
#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎬 Movie Ticket Booking - Railway MySQL Deployment');
console.log('================================================');
console.log('');

// User's Railway MySQL credentials
const DATABASE_URL = "mysql+pymysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@<RAILWAY_PRIVATE_DOMAIN>:3306/railway";

console.log('✅ Railway MySQL Database Detected!');
console.log('');
console.log('📋 Environment Variables for Render:');
console.log('====================================');
console.log('');
console.log('DATABASE_URL=' + DATABASE_URL);
console.log('SECRET_KEY=your-super-secret-jwt-key-change-this-in-production');
console.log('');
console.log('⚠️  IMPORTANT: Replace <RAILWAY_PRIVATE_DOMAIN> with your actual Railway domain');
console.log('   You can find this in your Railway dashboard');
console.log('');

console.log('🚀 Deployment Steps:');
console.log('===================');
console.log('');
console.log('1. Get your Railway domain from Railway dashboard');
console.log('2. Replace <RAILWAY_PRIVATE_DOMAIN> in DATABASE_URL');
console.log('3. Deploy backend to Render with environment variables');
console.log('4. Get your Render service URL');
console.log('5. Update frontend API URL');
console.log('6. Deploy frontend to Vercel');
console.log('');

console.log('💡 Example DATABASE_URL (after replacing domain):');
console.log('DATABASE_URL=mysql+pymysql://root:bROiSjvYcsejjOLgChUdodjlInzlxqLx@your-domain.railway.app:3306/railway');
console.log('');

rl.question('Press Enter to continue...', () => {
  console.log('');
  console.log('🔧 Next Steps:');
  console.log('1. Go to Railway dashboard and get your domain');
  console.log('2. Update DATABASE_URL with your actual domain');
  console.log('3. Deploy backend to Render with these environment variables');
  console.log('4. Get your Render service URL');
  console.log('5. Update frontend: node update-api-url.js https://your-app.onrender.com');
  console.log('6. Deploy frontend to Vercel');
  console.log('');
  console.log('📚 Your Railway MySQL is ready to use!');
  rl.close();
}); 
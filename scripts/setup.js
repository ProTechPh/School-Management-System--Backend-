#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up School Management System...\n');

// Generate JWT secrets
const accessSecret = crypto.randomBytes(64).toString('hex');
const refreshSecret = crypto.randomBytes(64).toString('hex');

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  } else {
    envContent = `# Server
PORT=4000
NODE_ENV=development
API_PREFIX=/api/v1

# MongoDB
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# JWT
JWT_ACCESS_SECRET=<random-64-hex>
JWT_REFRESH_SECRET=<random-64-hex>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Email (dev uses console)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM="SchoolMS <no-reply@schoolms.local>"
`;
  }

  // Replace JWT secrets
  envContent = envContent.replace('<random-64-hex>', accessSecret);
  envContent = envContent.replace('<random-64-hex>', refreshSecret);

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with generated JWT secrets');
} else {
  console.log('⚠️  .env file already exists, skipping creation');
}

console.log('\n📋 Next steps:');
console.log('1. Update .env file with your MongoDB Atlas connection string');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('\n🌐 Once running, visit:');
console.log('- API: http://localhost:4000/api/v1');
console.log('- Docs: http://localhost:4000/docs');
console.log('- Health: http://localhost:4000/health');

console.log('\n✨ Setup complete!');


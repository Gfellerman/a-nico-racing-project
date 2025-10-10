#!/usr/bin/env node

/**
 * Strapi Environment Setup Script
 * Generates secure keys and creates .env file for Strapi v5
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Generate secure random keys
function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

// Generate APP_KEYS (4 keys required)
function generateAppKeys() {
  return Array.from({ length: 4 }, () => generateSecureKey(32)).join(',');
}

// Get Codespace URL or use localhost
function getServerUrl() {
  const codespaceUrl = process.env.CODESPACE_NAME 
    ? `https://${process.env.CODESPACE_NAME}-1337.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : 'http://localhost:1337';
  return codespaceUrl;
}

// Create .env file content
function createEnvContent() {
  const serverUrl = getServerUrl();
  
  return `# Generated Environment Configuration for Strapi v5
# Generated on: ${new Date().toISOString()}

# Server Configuration
HOST=0.0.0.0
PORT=1337

# App Keys (DO NOT SHARE THESE)
APP_KEYS=${generateAppKeys()}

# JWT Secrets
ADMIN_JWT_SECRET=${generateSecureKey()}
JWT_SECRET=${generateSecureKey()}

# API and Transfer Tokens
API_TOKEN_SALT=${generateSecureKey()}
TRANSFER_TOKEN_SALT=${generateSecureKey()}

# Encryption
ENCRYPTION_KEY=${generateSecureKey()}

# Database (SQLite for development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Admin Panel Configuration
ADMIN_URL=${serverUrl}/admin
PUBLIC_ADMIN_URL=${serverUrl}/admin
SERVE_ADMIN_PANEL=true
ADMIN_AUTO_OPEN=false

# CORS Configuration
CORS_ENABLED=true
CORS_CREDENTIALS=true
CORS_ORIGIN=${serverUrl},http://localhost:3000,http://localhost:5173

# Development Flags
FLAG_NPS=false
FLAG_PROMOTE_EE=false

# Security
WEBHOOKS_POPULATE_RELATIONS=false
`;
}

// Main setup function
function setupEnvironment() {
  const envPath = path.join(__dirname, '.env');
  
  console.log('🚀 Setting up Strapi v5 environment...');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Creating backup...');
    fs.copyFileSync(envPath, `${envPath}.backup.${Date.now()}`);
  }
  
  // Create new .env file
  const envContent = createEnvContent();
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env file created successfully!');
  console.log(`📡 Server URL: ${getServerUrl()}`);
  console.log(`🔐 Admin URL: ${getServerUrl()}/admin`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Run: npm run develop');
  console.log('2. Open admin panel and create your first admin user');
  console.log('3. Configure your content types');
  console.log('');
  console.log('⚠️  Important: Never commit the .env file to version control!');
}

// Run setup if called directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment, generateSecureKey, generateAppKeys };

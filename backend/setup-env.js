#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

function generateAppKeys() {
  return Array.from({ length: 4 }, () => generateSecureKey(32)).join(',');
}

function getServerUrl() {
  const codespaceUrl = process.env.CODESPACE_NAME 
    ? `https://${process.env.CODESPACE_NAME}-1337.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : 'http://localhost:1337';
  return codespaceUrl;
}

const serverUrl = getServerUrl();
const envContent = `# Server Configuration
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
ENCRYPTION_KEY=${generateSecureKey()}

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Admin Panel URLs (CRITICAL for WebSocket fix)
ADMIN_URL=${serverUrl}/admin
PUBLIC_ADMIN_URL=${serverUrl}/admin
STRAPI_ADMIN_BACKEND_URL=${serverUrl}

# Development Configuration (Fixes the port 5173 issue)
NODE_ENV=development
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_TELEMETRY_DISABLED=true

# WebSocket Configuration (Stops the reload loop)
BROWSER=none
FAST_REFRESH=false
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
console.log(`🔐 Admin URL: ${serverUrl}/admin`);
console.log('🔧 WebSocket configuration fixed!');
console.log('🚀 Ready to start Strapi without reload issues!');

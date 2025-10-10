#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function getServerUrl() {
  const codespaceUrl = process.env.CODESPACE_NAME 
    ? `https://${process.env.CODESPACE_NAME}-1337.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : 'http://localhost:1337';
  return codespaceUrl;
}

const serverUrl = getServerUrl();
const envContent = `HOST=0.0.0.0
PORT=1337
APP_KEYS=${generateSecureKey()},${generateSecureKey()},${generateSecureKey()},${generateSecureKey()}
ADMIN_JWT_SECRET=${generateSecureKey()}
JWT_SECRET=${generateSecureKey()}
API_TOKEN_SALT=${generateSecureKey()}
TRANSFER_TOKEN_SALT=${generateSecureKey()}

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Admin Panel URLs
ADMIN_URL=${serverUrl}/admin
PUBLIC_ADMIN_URL=${serverUrl}/admin
`;

fs.writeFileSync('.env', envContent);
console.log('✅ Strapi v4 environment configured!');
console.log(`🔐 Admin URL: ${serverUrl}/admin`);

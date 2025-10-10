# Create the setup-env.js file (in backend folder)
cat > setup-env.js << 'EOF'
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
const envContent = `HOST=0.0.0.0
PORT=1337
APP_KEYS=${generateAppKeys()}
ADMIN_JWT_SECRET=${generateSecureKey()}
JWT_SECRET=${generateSecureKey()}
API_TOKEN_SALT=${generateSecureKey()}
TRANSFER_TOKEN_SALT=${generateSecureKey()}
ENCRYPTION_KEY=${generateSecureKey()}
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
ADMIN_URL=${serverUrl}/admin
PUBLIC_ADMIN_URL=${serverUrl}/admin
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
console.log(`🔐 Admin URL: ${serverUrl}/admin`);
EOF

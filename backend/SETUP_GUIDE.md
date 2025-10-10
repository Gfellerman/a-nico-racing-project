# 🏎️ ANRP Strapi Backend Setup Guide

## 🔧 Quick Fix for Admin URL Loop Issue

### Step 1: Generate Environment Variables
```bash
cd backend
npm run setup
```

This will create a `.env` file with all required secrets and configure URLs for your environment.

### Step 2: Start Strapi
```bash
npm run develop
```

### Step 3: Access Admin Panel
- **Codespaces**: `https://your-codespace-name-1337.preview.app.github.dev/admin`
- **Local**: `http://localhost:1337/admin`

---

## 🐛 Troubleshooting Common Issues

### Issue: "Admin URL Loop" or "Redirecting..."
**Root Cause**: Missing environment variables

**Solution**:
1. Run `npm run setup` to generate `.env` file
2. Restart Strapi: `npm run develop`
3. Clear browser cache/cookies
4. Try incognito/private browsing mode

### Issue: "CORS Error" or "Network Error"
**Root Cause**: Incorrect CORS configuration

**Solution**:
1. Check your environment variables match your actual URLs
2. Update `.env` file with correct CODESPACE_NAME if in Codespaces
3. For local development, ensure `http://localhost:1337` is in CORS_ORIGIN

### Issue: "Database Connection Error"
**Root Cause**: SQLite database issues

**Solution**:
```bash
rm -rf .tmp/
npm run develop
```

### Issue: "Cannot find module" errors
**Root Cause**: Dependency issues

**Solution**:
```bash
npm run reset  # Reinstalls all dependencies
```

---

## 📋 Manual Environment Setup

If the automatic setup doesn't work, create `.env` manually:

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env  # or use your preferred editor
```

**Required Variables**:
- `APP_KEYS`: 4 comma-separated base64 keys
- `ADMIN_JWT_SECRET`: Random 64+ character string
- `JWT_SECRET`: Random 64+ character string
- `API_TOKEN_SALT`: Random 64+ character string
- `TRANSFER_TOKEN_SALT`: Random 64+ character string
- `ENCRYPTION_KEY`: Random 64+ character string

**Generate keys manually**:
```bash
# Generate a single key
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# Generate APP_KEYS (run 4 times and join with commas)
node -e "console.log(Array.from({length:4}, () => require('crypto').randomBytes(32).toString('base64url')).join(','))"
```

---

## 🌐 Environment-Specific Configuration

### GitHub Codespaces
The setup script automatically detects Codespaces and configures:
- Port forwarding for 1337
- CORS settings for preview URLs
- Admin URL with proper domain

### Local Development
For local development:
```env
HOST=0.0.0.0
PORT=1337
ADMIN_URL=http://localhost:1337/admin
CORS_ORIGIN=http://localhost:1337,http://localhost:3000,http://localhost:5173
```

### Production
For production deployment:
1. Generate new secure keys (never reuse development keys)
2. Set proper domain URLs
3. Configure HTTPS
4. Use environment-specific database

---

## ✅ Verification Checklist

- [ ] `.env` file exists with all required variables
- [ ] `npm run develop` starts without errors
- [ ] Admin URL loads without redirect loops
- [ ] Can create admin user successfully
- [ ] API endpoints respond correctly

---

## 📞 Next Steps After Setup

1. **Create Admin User**: First time setup will prompt for admin creation
2. **Configure Content Types**: Set up Projects, Timeline Tasks, etc.
3. **Test API**: Verify endpoints work with frontend
4. **Import Initial Data**: Add the 4 car projects

---

## 🔍 Debugging Commands

```bash
# Check environment variables
node -e "console.log(process.env)" | grep -E "(ADMIN|JWT|SALT|KEY)"

# Test database connection
npm run strapi console
# Then in console: strapi.db.connection.raw('SELECT 1')

# Check server configuration
node -e "console.log(require('./config/server.js')({env: process.env}))"

# Verify admin configuration
node -e "console.log(require('./config/admin.ts').default({env: process.env}))"
```

---

## 📚 Useful Resources

- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/quick-start)
- [Environment Variables Guide](https://docs.strapi.io/dev-docs/configurations/environment)
- [Admin Panel Configuration](https://docs.strapi.io/dev-docs/configurations/admin-panel)
- [Troubleshooting Guide](https://docs.strapi.io/dev-docs/troubleshooting)

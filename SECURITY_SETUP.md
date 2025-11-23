# Security Setup Guide

## ⚠️ IMPORTANT: Before Pushing to GitHub

Your `.env` file contains sensitive credentials and should NEVER be committed to GitHub.

## ✅ What's Been Done

1. Created `.gitignore` to exclude sensitive files
2. Created `.env.example` as a template (safe to commit)
3. Your actual `.env` file is now protected

## 🔒 Sensitive Data Protected

The following sensitive information is now secured:

- **MongoDB URI** with username/password
- **JWT Secret Key**
- **Email credentials**
- **Admin password**
- **Groq API Key**

## 📋 Setup Instructions for New Developers

When someone clones your repository, they should:

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Fill in their own credentials in `.env`:
   - Get MongoDB URI from MongoDB Atlas
   - Generate a secure JWT secret (32+ characters)
   - Add their email credentials
   - Set admin password
   - Get Groq API key from https://console.groq.com

## 🔐 Security Best Practices

### For MongoDB:
- Use MongoDB Atlas with IP whitelist
- Create a dedicated database user (not admin)
- Use strong passwords
- Enable network access restrictions

### For JWT:
- Use a random 32+ character secret
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### For Email:
- Use Gmail App Passwords (not your actual password)
- Enable 2FA on your Gmail account
- Generate app password at: https://myaccount.google.com/apppasswords

### For Groq API:
- Get free API key from https://console.groq.com
- Monitor usage to stay within limits
- Rotate keys periodically

## 🚀 Before Deploying to Production

1. **Change all default passwords**
2. **Use environment-specific secrets**
3. **Enable HTTPS only**
4. **Set up proper CORS origins**
5. **Use production-grade MongoDB cluster**
6. **Enable rate limiting**
7. **Set up monitoring and logging**

## 📝 Environment Variables Checklist

Before running the application, ensure these are set:

- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRE
- [ ] PORT
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD
- [ ] GROQ_API_KEY

## ⚡ Quick Start

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

## 🆘 If You Accidentally Committed Secrets

If you already pushed secrets to GitHub:

1. **Immediately rotate all credentials:**
   - Change MongoDB password
   - Generate new JWT secret
   - Change email password
   - Regenerate Groq API key
   - Change admin password

2. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (⚠️ use with caution):**
   ```bash
   git push origin --force --all
   ```

## 📞 Support

For security concerns, contact the repository maintainer privately.

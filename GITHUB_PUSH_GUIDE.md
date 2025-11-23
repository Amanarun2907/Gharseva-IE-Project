# 🚀 GitHub Push Guide - Secure Setup

## Step-by-Step Guide to Push Your Code Safely

### ✅ Step 1: Verify Security Files

Check that these files exist:
- `.gitignore` ✓
- `backend/.env.example` ✓
- `SECURITY_SETUP.md` ✓
- `PRE_COMMIT_CHECKLIST.md` ✓

### ✅ Step 2: Verify .env is Protected

Run this command:
```bash
cat .gitignore | grep ".env"
```

You should see:
```
.env
.env.local
backend/.env
frontend/.env
```

### ✅ Step 3: Initialize Git Repository

```bash
# Initialize git
git init

# Verify .gitignore is working
git status
```

**IMPORTANT**: Check the output. You should NOT see:
- `backend/.env`
- Any file with credentials

You SHOULD see:
- `backend/.env.example`
- `.gitignore`
- Source code files

### ✅ Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "gharsewa")
3. **DO NOT** initialize with README (we already have one)
4. Copy the repository URL

### ✅ Step 5: Add Files to Git

```bash
# Add all files (excluding .env automatically)
git add .

# Verify what's being added
git status

# Check for any .env files
git status | grep ".env"
# Should only show .env.example, NOT .env
```

### ✅ Step 6: Verify No Secrets

```bash
# Check staged files for secrets
git diff --cached | grep -i "mongodb+srv"
git diff --cached | grep -i "gsk_"
git diff --cached | grep -i "password.*:"

# If you see any actual credentials, STOP and remove them!
```

### ✅ Step 7: Make First Commit

```bash
git commit -m "Initial commit - GharSewa household services platform"
```

### ✅ Step 8: Add Remote and Push

```bash
# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/gharsewa.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### ✅ Step 9: Verify on GitHub

1. Go to your GitHub repository
2. Check that `backend/.env` is NOT visible
3. Check that `backend/.env.example` IS visible
4. Verify `.gitignore` is present

### ✅ Step 10: Update Repository Settings

On GitHub:
1. Go to Settings → Secrets and variables → Actions
2. Add these secrets for CI/CD (optional):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`

## 🔒 Security Verification Checklist

Before pushing, verify:

- [ ] `.env` file is NOT in git status
- [ ] `.env.example` exists with placeholders
- [ ] `.gitignore` includes `.env`
- [ ] No MongoDB URIs in code
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] README mentions security setup

## 🚨 Common Mistakes to Avoid

❌ **DON'T**:
- Commit `.env` file
- Hardcode credentials in source code
- Push without checking `git status`
- Use `git add .` without verifying
- Share your `.env` file with anyone

✅ **DO**:
- Use `.env.example` as template
- Keep `.env` in `.gitignore`
- Review `git diff` before committing
- Rotate credentials regularly
- Use environment variables

## 🆘 Emergency: Secrets Already Pushed?

If you accidentally pushed secrets:

### Immediate Actions:
1. **Rotate ALL credentials immediately**:
   ```bash
   # Change these NOW:
   - MongoDB password (in MongoDB Atlas)
   - JWT secret (generate new one)
   - Email password (in Gmail)
   - Groq API key (regenerate)
   - Admin password
   ```

2. **Remove from Git history**:
   ```bash
   # Remove .env from all commits
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push (this rewrites history)
   git push origin --force --all
   ```

3. **Contact GitHub Support**:
   - Request cache purge
   - Explain the situation

### Prevention:
- Set up pre-commit hooks
- Use git-secrets tool
- Enable GitHub secret scanning

## 📝 Useful Git Commands

```bash
# Check what's being tracked
git ls-files

# Check if .env is ignored
git check-ignore backend/.env
# Should output: backend/.env

# See what will be committed
git diff --cached --name-only

# Unstage a file
git reset HEAD backend/.env

# Remove file from git but keep locally
git rm --cached backend/.env
```

## 🔐 Setting Up for Team Members

When someone clones your repo:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/gharsewa.git
cd gharsewa

# Setup backend
cd backend
cp .env.example .env
# Edit .env with their credentials
npm install

# Setup frontend
cd ../frontend
npm install

# Run application
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm start
```

## 📚 Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Ignore Patterns](https://git-scm.com/docs/gitignore)
- [Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## ✨ Quick Reference

```bash
# Safe workflow
git status                    # Check what's changed
git add .                     # Add files (respects .gitignore)
git status                    # Verify .env is NOT listed
git commit -m "message"       # Commit
git push origin main          # Push

# If you see .env in git status
git reset HEAD backend/.env   # Unstage it
# Then add .env to .gitignore if not already there
```

---

**Remember**: Security is not optional. Take time to verify before pushing!

🎉 **You're ready to push safely to GitHub!**

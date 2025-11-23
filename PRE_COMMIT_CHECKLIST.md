# ✅ Pre-Commit Security Checklist

Before pushing to GitHub, verify these items:

## 🔒 Environment Variables

- [ ] `.env` file is NOT staged for commit
- [ ] `.env.example` exists with placeholder values
- [ ] `.gitignore` includes `.env` and `backend/.env`
- [ ] No hardcoded credentials in source code
- [ ] No API keys in frontend code

## 🔍 Check for Exposed Secrets

Run these commands to check:

```bash
# Check if .env is in git
git status | grep ".env"
# Should show nothing or only .env.example

# Check for potential secrets in staged files
git diff --cached | grep -i "password\|secret\|api_key\|mongodb"
# Review any matches carefully

# List all files to be committed
git diff --cached --name-only
# Verify .env is NOT in this list
```

## 📝 Files That Should Be Committed

✅ Safe to commit:
- `backend/.env.example`
- `.gitignore`
- `SECURITY_SETUP.md`
- `README.md`
- All source code files
- `package.json` files

❌ Never commit:
- `backend/.env`
- `frontend/.env`
- `node_modules/`
- Any file with actual credentials

## 🚨 If You Find Secrets Staged

```bash
# Unstage the file
git reset HEAD backend/.env

# Or reset all staged files
git reset HEAD .

# Then add files selectively
git add .gitignore
git add backend/.env.example
git add SECURITY_SETUP.md
# etc...
```

## 🔐 Verify .gitignore is Working

```bash
# This should show .env is ignored
git check-ignore backend/.env
# Output: backend/.env

# This should show nothing (not ignored)
git check-ignore backend/.env.example
# Output: (nothing)
```

## 📤 Safe Push Commands

```bash
# 1. Check status
git status

# 2. Add files (excluding .env automatically)
git add .

# 3. Verify what's staged
git status

# 4. Commit
git commit -m "Your commit message"

# 5. Push
git push origin main
```

## 🆘 Emergency: Already Pushed Secrets?

If you accidentally pushed secrets:

1. **Immediately rotate ALL credentials:**
   - MongoDB password
   - JWT secret
   - Email password
   - API keys
   - Admin password

2. **Contact GitHub Support** to purge cached data

3. **Remove from history** (advanced):
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

## ✨ Best Practices

1. **Always review** `git diff` before committing
2. **Use** `git add <specific-files>` instead of `git add .` when unsure
3. **Double-check** `git status` before pushing
4. **Keep** `.env.example` updated with new variables
5. **Document** required environment variables in README

## 🎯 Quick Verification Script

Create this as `check-secrets.sh`:

```bash
#!/bin/bash
echo "🔍 Checking for secrets..."

if git diff --cached --name-only | grep -q "\.env$"; then
    echo "❌ ERROR: .env file is staged!"
    echo "Run: git reset HEAD backend/.env"
    exit 1
fi

if git diff --cached | grep -qi "mongodb+srv://.*:.*@"; then
    echo "⚠️  WARNING: Possible MongoDB URI found!"
    exit 1
fi

if git diff --cached | grep -qi "gsk_[a-zA-Z0-9]"; then
    echo "⚠️  WARNING: Possible Groq API key found!"
    exit 1
fi

echo "✅ No obvious secrets detected"
echo "📋 Files to be committed:"
git diff --cached --name-only
```

Run before commit:
```bash
chmod +x check-secrets.sh
./check-secrets.sh
```

---

**Remember**: It's easier to prevent secrets from being committed than to remove them later!

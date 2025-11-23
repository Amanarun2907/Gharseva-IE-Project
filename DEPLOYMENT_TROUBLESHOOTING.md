# 🔧 Deployment Troubleshooting Guide

Common issues and solutions when deploying GharSewa.

---

## 🗄️ MongoDB Atlas Issues

### ❌ "MongoServerError: bad auth"
**Cause**: Wrong password in connection string

**Solution**:
1. Go to MongoDB Atlas → Database Access
2. Edit user → Reset password
3. Copy new password
4. Update `MONGODB_URI` in Render
5. Make sure to replace `<password>` in connection string

### ❌ "MongooseServerSelectionError: connect ETIMEDOUT"
**Cause**: IP not whitelisted

**Solution**:
1. MongoDB Atlas → Network Access
2. Delete existing entries
3. Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
4. Wait 2 minutes for changes to propagate

### ❌ "Database not found"
**Cause**: Missing database name in connection string

**Solution**:
Connection string should look like:
```
mongodb+srv://user:pass@cluster.mongodb.net/gharsewa?retryWrites=true
                                                    ^^^^^^^^
                                                    Add this!
```

---

## 🔧 Render Backend Issues

### ❌ "Build failed"
**Cause**: Missing dependencies or wrong directory

**Solution**:
1. Check Root Directory is set to `backend`
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Check Render logs for specific error

### ❌ "Application failed to respond"
**Cause**: Wrong PORT or server not starting

**Solution**:
1. Ensure `PORT=10000` in environment variables
2. Check server.js uses `process.env.PORT`
3. View logs: Render Dashboard → Logs tab

### ❌ "Service unavailable" or slow first load
**Cause**: Free tier sleeps after 15 minutes

**Solution**:
- This is normal behavior
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast
- Upgrade to paid plan ($7/mo) to prevent sleeping

### ❌ Environment variables not working
**Cause**: Variables not saved or typo

**Solution**:
1. Go to Environment tab
2. Check all variables are present
3. No extra spaces in keys or values
4. Click **Save Changes** (triggers redeploy)

### ❌ "npm run seed" fails
**Cause**: Database connection issue or already seeded

**Solution**:
1. Check MongoDB connection works first
2. If already seeded, it's okay to skip
3. Check Shell output for specific error

---

## 🎨 Vercel Frontend Issues

### ❌ "Build failed"
**Cause**: Wrong directory or missing dependencies

**Solution**:
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Framework Preset: **Vite**
5. Check deployment logs for specific error

### ❌ Blank page or "Cannot GET /"
**Cause**: Wrong output directory or routing issue

**Solution**:
1. Ensure `vercel.json` exists in root
2. Output directory must be `dist`
3. Check browser console for errors

### ❌ "Failed to fetch" or API errors
**Cause**: Wrong backend URL

**Solution**:
1. Vercel Dashboard → Settings → Environment Variables
2. Check `VITE_API_URL` is correct:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Must include `/api` at the end
4. No trailing slash
5. Redeploy after changing

### ❌ Environment variable not working
**Cause**: Must start with `VITE_`

**Solution**:
- Vite requires prefix: `VITE_API_URL`
- Not just `API_URL`
- Redeploy after adding

---

## 🔒 CORS Issues

### ❌ "CORS policy: No 'Access-Control-Allow-Origin'"
**Cause**: Backend not configured for frontend domain

**Solution**:
1. Render → Environment → Add:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
2. Must match Vercel URL exactly
3. No trailing slash
4. No `http://` if Vercel uses `https://`
5. Save and wait for redeploy

### ❌ CORS error only in production, works locally
**Cause**: Missing CORS_ORIGIN in production

**Solution**:
- Locally, CORS is set to `*` (allow all)
- Production needs specific origin
- Add `CORS_ORIGIN` environment variable

---

## 🔐 Authentication Issues

### ❌ "Invalid credentials" when logging in
**Cause**: Database not seeded or wrong password

**Solution**:
1. Run seed script: Render Shell → `npm run seed`
2. Use exact credentials:
   - Admin: admin@gharsewa.com / Admin@123
   - Customer: customer1@example.com / Customer@123
3. Check MongoDB Atlas → Browse Collections → users

### ❌ "Token expired" or "Unauthorized"
**Cause**: JWT_SECRET mismatch or expired token

**Solution**:
1. Clear browser localStorage
2. Verify `JWT_SECRET` is set in Render
3. Try logging in again

### ❌ OTP not received
**Cause**: Email configuration wrong

**Solution**:
1. Use Gmail App Password (not regular password)
2. Enable 2FA on Gmail first
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Update `EMAIL_PASSWORD` in Render

---

## 📧 Email Issues

### ❌ "Invalid login: 535-5.7.8 Username and Password not accepted"
**Cause**: Using regular Gmail password instead of App Password

**Solution**:
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Search for **App Passwords**
4. Generate password for "Mail"
5. Use this 16-character password as `EMAIL_PASSWORD`

### ❌ Emails not sending
**Cause**: Gmail blocking or wrong configuration

**Solution**:
1. Check environment variables:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=16_char_app_password
   ```
2. Try different Gmail account
3. Check Render logs for email errors

---

## 🤖 Groq AI Chatbot Issues

### ❌ Chatbot not responding
**Cause**: Missing or invalid GROQ_API_KEY

**Solution**:
1. Get free API key: https://console.groq.com
2. Sign up → Create API Key
3. Add to Render environment variables:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
4. Redeploy

### ❌ "Rate limit exceeded"
**Cause**: Free tier limits reached

**Solution**:
- Groq free tier: 30 requests/minute
- Wait a minute and try again
- Consider upgrading if needed

---

## 🌐 General Issues

### ❌ "This site can't be reached"
**Cause**: Service not deployed or wrong URL

**Solution**:
1. Check service status in Render/Vercel dashboard
2. Verify URL is correct (no typos)
3. Wait for deployment to complete

### ❌ Changes not reflecting
**Cause**: Cache or deployment not triggered

**Solution**:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if deployment was triggered in dashboard
4. Manual redeploy: Dashboard → Manual Deploy

### ❌ "Out of memory" during build
**Cause**: Free tier memory limits

**Solution**:
1. Usually temporary, try redeploying
2. Check for large dependencies
3. Consider upgrading plan if persistent

---

## 🔍 Debugging Steps

### Check Backend Health:
```
Visit: https://your-backend.onrender.com/health
Should return: {"success":true,"message":"Server is running"}
```

### Check Frontend:
```
1. Open browser console (F12)
2. Look for errors in Console tab
3. Check Network tab for failed requests
```

### Check Logs:
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments → View Function Logs
- **MongoDB**: Atlas → Metrics

### Test Locally:
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📞 Still Having Issues?

### Checklist:
- [ ] MongoDB Atlas IP whitelist: 0.0.0.0/0
- [ ] MongoDB connection string has password and database name
- [ ] Render environment variables all set
- [ ] Vercel `VITE_API_URL` points to Render backend
- [ ] `CORS_ORIGIN` in Render matches Vercel URL
- [ ] Seed script ran successfully
- [ ] Both services show "Live" status

### Get Help:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for client errors
4. Test backend `/health` endpoint
5. Verify all environment variables

---

## 🎯 Quick Fixes

**90% of issues are:**
1. Wrong environment variables
2. CORS misconfiguration
3. MongoDB connection string errors
4. Forgot to run seed script
5. Using wrong credentials

**Quick Reset:**
1. Delete and recreate services
2. Double-check all environment variables
3. Run seed script again
4. Clear browser cache
5. Try different browser

---

**Most issues resolve within 5-10 minutes of checking these common causes!**

Good luck! 🚀

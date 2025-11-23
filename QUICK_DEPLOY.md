# ⚡ Quick Deploy Guide (15 Minutes)

Ultra-fast deployment guide. Follow these exact steps.

---

## 1️⃣ MongoDB Atlas (5 minutes)

1. Go to https://mongodb.com/cloud/atlas/register
2. Sign up → Create FREE cluster
3. **Database Access** → Add User:
   - Username: `gharsewa`
   - Password: Click "Autogenerate" → **COPY IT**
4. **Network Access** → Add IP → **Allow from Anywhere**
5. **Database** → Connect → **Drivers** → Copy connection string
6. Replace `<password>` with your password
7. Add `/gharsewa` before the `?`
8. **SAVE THIS STRING**

---

## 2️⃣ Render Backend (7 minutes)

1. Go to https://render.com → Sign up with GitHub
2. **New** → **Web Service** → Connect your repo
3. Settings:
   - Name: `gharsewa-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
4. **Environment Variables** → Add these:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=<paste_your_mongodb_string_here>
JWT_SECRET=gharsewa_jwt_secret_key_minimum_32_characters_long_2024
JWT_EXPIRE=24h
OTP_EXPIRY_MINUTES=10
COMMISSION_RATE=10
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin@gharsewa.com
ADMIN_PASSWORD=Admin@123456
GROQ_API_KEY=gsk_your_key_here
```

5. Click **Create Web Service**
6. Wait 5 minutes → Copy your URL: `https://xxx.onrender.com`
7. Go to **Shell** tab → Run: `npm run seed`

---

## 3️⃣ Vercel Frontend (3 minutes)

1. Go to https://vercel.com → Sign up with GitHub
2. **New Project** → Import your repo
3. Settings:
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```
5. Click **Deploy**
6. Wait 2 minutes → Copy your URL: `https://xxx.vercel.app`

---

## 4️⃣ Final Step (1 minute)

1. Go back to Render → Your service → **Environment**
2. Add variable:
   ```
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```
3. Save (auto-redeploys)

---

## ✅ Test It!

Visit your Vercel URL → Login with:
- **Admin**: admin@gharsewa.com / Admin@123
- **Customer**: customer1@example.com / Customer@123

---

## 🚨 Troubleshooting

**Backend not responding?**
- Wait 30 seconds (free tier wakes from sleep)
- Check Render logs

**CORS error?**
- Verify `CORS_ORIGIN` matches Vercel URL exactly
- No trailing slash

**Can't login?**
- Did you run `npm run seed` in Render Shell?
- Check MongoDB connection string

---

**Done!** 🎉 Your app is live!

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

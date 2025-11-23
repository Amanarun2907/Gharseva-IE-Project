# 🚀 GharSewa Deployment Guide

Complete step-by-step guide to deploy your GharSewa application for FREE.

## 📋 Prerequisites

Before starting, create accounts on:
1. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas/register
2. **Render** - https://render.com (for backend)
3. **Vercel** - https://vercel.com (for frontend)
4. **GitHub** - Ensure your code is pushed to GitHub

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Database
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub (easiest)
3. Choose **FREE M0 Cluster**
4. Select **AWS** as provider
5. Choose region closest to you (e.g., Mumbai for India)
6. Cluster Name: `gharsewa-cluster`
7. Click **Create Cluster** (takes 3-5 minutes)

### 1.2 Configure Database Access
1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `gharsewa_admin`
5. Click **Autogenerate Secure Password** - SAVE THIS PASSWORD!
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### 1.3 Configure Network Access
1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 1.4 Get Connection String
1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://gharsewa_admin:<password>@gharsewa-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`: `/gharsewa?retryWrites=true&w=majority`
8. **SAVE THIS - You'll need it later!**

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository: `Gharseva-IE-Project`
3. Configure:
   - **Name**: `gharsewa-backend`
   - **Region**: Oregon (US West) - Free tier available
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

### 2.3 Add Environment Variables
Click **Advanced** → **Add Environment Variable** and add these:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://gharsewa_admin:YOUR_PASSWORD@gharsewa-cluster.xxxxx.mongodb.net/gharsewa?retryWrites=true&w=majority
JWT_SECRET=gharsewa_super_secret_jwt_key_2024_production_minimum_32_chars
JWT_EXPIRE=24h
OTP_EXPIRY_MINUTES=10
SESSION_TIMEOUT_MINUTES=60
COMMISSION_RATE=10
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin@gharsewa.com
ADMIN_PASSWORD=Admin@123456
GROQ_API_KEY=your_groq_api_key_here
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your MongoDB password
- Replace `your_email@gmail.com` with your Gmail
- For `EMAIL_PASSWORD`, use Gmail App Password (see Step 2.4)
- Get `GROQ_API_KEY` from https://console.groq.com (free)

### 2.4 Setup Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Search for **App Passwords**
4. Create new app password for "Mail"
5. Copy the 16-character password
6. Use this as `EMAIL_PASSWORD`

### 2.5 Deploy
1. Click **Create Web Service**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://gharsewa-backend.onrender.com`
4. Test it: Visit `https://gharsewa-backend.onrender.com/health`
5. Should see: `{"success":true,"message":"Server is running"}`
6. **SAVE THIS URL - You'll need it for frontend!**

### 2.6 Seed Database (One-time)
1. In Render dashboard, go to your service
2. Click **Shell** tab
3. Run: `npm run seed`
4. This creates initial data (services, admin user, etc.)

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 3.2 Import Project
1. Click **Add New** → **Project**
2. Import `Gharseva-IE-Project` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable
Click **Environment Variables** and add:

```
VITE_API_URL=https://gharsewa-backend.onrender.com/api
```

**Replace with your actual Render backend URL from Step 2.5!**

### 3.4 Deploy
1. Click **Deploy**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://gharsewa-ie-project.vercel.app`
4. **This is your live website!**

### 3.5 Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Add new variable:
   ```
   CORS_ORIGIN=https://gharsewa-ie-project.vercel.app
   ```
5. Replace with your actual Vercel URL
6. Click **Save Changes** (backend will redeploy)

---

## ✅ Step 4: Test Your Deployment

### 4.1 Test Backend
Visit: `https://your-backend.onrender.com/health`
Should see: `{"success":true,"message":"Server is running"}`

### 4.2 Test Frontend
1. Visit your Vercel URL
2. You should see the GharSewa homepage
3. Try logging in with seeded data:
   - **Admin**: admin@gharsewa.com / Admin@123
   - **Customer**: customer1@example.com / Customer@123
   - **Worker**: worker1@example.com / Worker@123

### 4.3 Common Issues

**Backend sleeps after 15 minutes (Render free tier)**
- First request after sleep takes 30-60 seconds
- This is normal for free tier
- Upgrade to paid plan ($7/month) to avoid sleeping

**CORS errors**
- Make sure `CORS_ORIGIN` in backend matches your Vercel URL exactly
- No trailing slash in URL

**Database connection fails**
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string has correct password
- Ensure database name is included: `/gharsewa?`

**Frontend can't reach backend**
- Verify `VITE_API_URL` in Vercel matches your Render URL
- Check backend is running: visit `/health` endpoint

---

## 🎉 You're Live!

Your application is now deployed and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Database: MongoDB Atlas (managed)

### Next Steps:
1. Share your frontend URL with users
2. Monitor usage in Render/Vercel dashboards
3. Check MongoDB Atlas for database metrics
4. Set up custom domain (optional, paid)

### Free Tier Limits:
- **Vercel**: Unlimited bandwidth, 100GB/month
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **MongoDB Atlas**: 512MB storage, shared cluster

---

## 🔄 Updating Your Deployment

### Update Code:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Vercel auto-deploys frontend (1-2 minutes)
4. Render auto-deploys backend (3-5 minutes)

### Update Environment Variables:
- **Render**: Dashboard → Environment → Edit → Save
- **Vercel**: Dashboard → Settings → Environment Variables → Edit → Save

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Deployments → View Logs
3. Check MongoDB Atlas: Metrics & Logs

**Common Commands:**
```bash
# Test backend locally
cd backend
npm run dev

# Test frontend locally
cd frontend
npm run dev
```

---

**Deployment Status**: ✅ Ready to Deploy
**Estimated Time**: 30-45 minutes
**Cost**: $0 (100% Free)

Good luck! 🚀

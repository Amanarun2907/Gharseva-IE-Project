# ✅ Deployment Checklist

Quick reference checklist for deploying GharSewa.

## Before You Start

- [ ] GitHub account created
- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas account created
- [ ] Render account created (sign up with GitHub)
- [ ] Vercel account created (sign up with GitHub)

---

## 🗄️ MongoDB Atlas Setup

- [ ] Created free M0 cluster
- [ ] Added database user with password (saved password)
- [ ] Whitelisted all IPs (0.0.0.0/0)
- [ ] Got connection string
- [ ] Replaced `<password>` in connection string
- [ ] Added database name `/gharsewa` to connection string
- [ ] Connection string saved for later

**Your MongoDB URI:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/gharsewa?retryWrites=true&w=majority
```

---

## 🔧 Render Backend Setup

- [ ] Connected GitHub repository
- [ ] Created Web Service
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command to `npm install`
- [ ] Set Start Command to `npm start`
- [ ] Selected Free plan
- [ ] Added all environment variables (see list below)
- [ ] Deployed successfully
- [ ] Tested `/health` endpoint
- [ ] Ran seed script in Shell: `npm run seed`
- [ ] Saved backend URL

**Your Backend URL:**
```
https://your-backend-name.onrender.com
```

### Environment Variables to Add:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<generate_random_32_char_string>
JWT_EXPIRE=24h
OTP_EXPIRY_MINUTES=10
SESSION_TIMEOUT_MINUTES=60
COMMISSION_RATE=10
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_gmail>
EMAIL_PASSWORD=<gmail_app_password>
ADMIN_EMAIL=admin@gharsewa.com
ADMIN_PASSWORD=<choose_secure_password>
GROQ_API_KEY=<get_from_groq_console>
```

---

## 🎨 Vercel Frontend Setup

- [ ] Imported GitHub repository
- [ ] Set Framework Preset to Vite
- [ ] Set Root Directory to `frontend`
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist`
- [ ] Added environment variable `VITE_API_URL`
- [ ] Deployed successfully
- [ ] Website loads correctly
- [ ] Saved frontend URL

**Your Frontend URL:**
```
https://your-project-name.vercel.app
```

### Environment Variable to Add:
```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 🔄 Final Configuration

- [ ] Added `CORS_ORIGIN` to Render backend environment variables
- [ ] Set `CORS_ORIGIN` to your Vercel frontend URL
- [ ] Backend redeployed with new CORS setting
- [ ] Tested frontend can communicate with backend

---

## ✅ Testing

- [ ] Backend health check works: `https://your-backend.onrender.com/health`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Can view homepage
- [ ] Can register new user
- [ ] Can login with test credentials:
  - Admin: admin@gharsewa.com / Admin@123
  - Customer: customer1@example.com / Customer@123
  - Worker: worker1@example.com / Worker@123
- [ ] Dashboard loads after login
- [ ] Can browse services
- [ ] Can view workers

---

## 📝 Important URLs & Credentials

### Live URLs
- **Frontend**: ___________________________________
- **Backend**: ___________________________________
- **MongoDB**: ___________________________________

### Admin Login
- **Email**: admin@gharsewa.com
- **Password**: ___________________________________

### Test Accounts (from seed data)
- **Customer**: customer1@example.com / Customer@123
- **Worker**: worker1@example.com / Worker@123

---

## 🚨 Troubleshooting

### Backend not responding
- [ ] Check Render logs
- [ ] Verify MongoDB connection string
- [ ] Check all environment variables are set
- [ ] Wait 30-60 seconds (free tier wakes from sleep)

### Frontend shows errors
- [ ] Check Vercel deployment logs
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check browser console for errors
- [ ] Verify backend is running

### CORS errors
- [ ] Verify `CORS_ORIGIN` in backend matches frontend URL exactly
- [ ] No trailing slash in URLs
- [ ] Backend redeployed after adding CORS_ORIGIN

### Database errors
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Connection string has correct password
- [ ] Database name included in connection string
- [ ] User has read/write permissions

---

## 🎉 Deployment Complete!

Once all items are checked, your application is live and ready to use!

**Share your frontend URL with users and start testing!**

---

**Need Help?** See `DEPLOYMENT_GUIDE.md` for detailed instructions.

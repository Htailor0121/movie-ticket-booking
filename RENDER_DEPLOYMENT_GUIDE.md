# Render Deployment Guide

This guide will help you configure your Render deployment manually in the dashboard.

## 🚀 Step-by-Step Configuration

### 1. Go to Render Dashboard
- Visit [render.com](https://render.com)
- Sign in to your account
- Go to your web service

### 2. Configure Service Settings

**In the "Settings" tab, set these values:**

#### General Settings:
- **Name**: `movie-booking-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users

#### Build & Deploy Settings:
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Set Environment Variables

**In the "Environment" tab, add these variables:**

```
DATABASE_URL=mysql+pymysql://root:bROiSjvYcsejjOLfChUdodjlInzlxqLx@your-domain.railway.app:3306/railway
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Replace `your-domain.railway.app` with your actual Railway domain.

### 4. Save and Deploy

1. Click "Save Changes"
2. Go to "Manual Deploy" tab
3. Click "Deploy latest commit"

## 🔧 Troubleshooting

### If you still get "Could not import module 'main'":

1. **Check Root Directory**: Make sure it's set to `backend`
2. **Check File Structure**: Verify main.py exists in backend folder
3. **Check Build Logs**: Look for any import errors during build

### Alternative Start Command:
If the above doesn't work, try:
```
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Check File Structure:
Your backend folder should contain:
```
backend/
├── main.py
├── requirements.txt
├── database.py
├── models.py
├── schemas.py
├── auth.py
├── routes.py
└── routes/
```

## ✅ Success Indicators

When deployment is successful, you should see:
- ✅ Build completes without errors
- ✅ Service starts successfully
- ✅ You can access your API at the provided URL
- ✅ API docs available at `/docs`

## 🎯 Next Steps

1. Configure Render dashboard as above
2. Set environment variables
3. Deploy and test
4. Get your service URL
5. Deploy frontend to Vercel

Your backend should deploy successfully with these settings! 🚀 
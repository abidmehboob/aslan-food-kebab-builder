# 🎨 Deploy to Render.com - Step by Step Guide

## 🚀 Quick Render Deployment

Render.com offers **750 free hours per month** and automatic SSL certificates!

### Option 1: One-Click Deploy (Recommended) ⭐

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/aslan-food-kebab-builder)

### Option 2: Manual Deployment 🔧

#### Step 1: Push to GitHub
```bash
# If not already done:
git remote add origin https://github.com/yourusername/aslan-food-kebab-builder.git
git branch -M main
git push -u origin main
```

#### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `aslan-food-kebab-builder`
- **Environment**: `Node`
- **Region**: `Ohio (US East)` (closest to users)
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

#### Step 4: Environment Variables
Add these **required** variables in the Render dashboard:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-32-character-key-here
API_PREFIX=/api
API_VERSION=v1
```

**Optional variables (if you want database features):**
```bash
# Only add if you have a MongoDB database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aslan-food
```

**To generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **Note**: The kebab builder works perfectly without MongoDB! It uses static ingredient data. Only add MONGODB_URI if you plan to add user accounts, order history, or dynamic ingredients later.

#### Step 5: Advanced Settings
- **Auto-Deploy**: `Yes` (deploys on git push)
- **Root Directory**: Leave empty (uses repository root)

## 🔍 Render-Specific Configuration

### Build Process
```bash
# Render will run:
cd backend && npm install

# Then start with:
cd backend && npm start
```

### File Structure for Render
```
aslan-food/
├── backend/           # Backend API server
│   ├── server.js     # Main server file (serves frontend too)
│   ├── package.json  # Dependencies
│   └── routes/       # API routes
├── frontend/         # Static files served by backend
│   ├── index.html    # Main app
│   └── kebab-builder.js
└── render.yaml       # Render configuration
```

## 🌐 After Deployment

### Your App URLs
- **Main App**: `https://aslan-food-kebab-builder.onrender.com`
- **API Health**: `https://aslan-food-kebab-builder.onrender.com/api/health`
- **Ingredients**: `https://aslan-food-kebab-builder.onrender.com/api/kebab-builder/config`

### Verify Deployment
1. ✅ Check health endpoint returns status
2. ✅ Main page loads with all ingredients
3. ✅ Ingredient selection works
4. ✅ Price calculation functions
5. ✅ Mobile responsive design

## 🐛 Render Troubleshooting

### Common Issues & Solutions

**Issue: Build fails**
```bash
# Solution: Check build logs in Render dashboard
# Verify package.json exists in backend folder
```

**Issue: App doesn't start**
```bash
# Solution: Check start command is correct
# Start Command: cd backend && npm start
```

**Issue: Static files not loading**
```bash
# Solution: Verify frontend files are served by backend
# Check express.static configuration in server.js
```

**Issue: API calls fail**
```bash
# Solution: Check CORS settings in backend
# Verify API base URL detection in frontend
```

### Render Logs
Access logs in Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. View real-time application logs

## 📊 Render Features

### Free Tier Includes:
- ✅ **750 hours/month** (enough for 24/7 operation)
- ✅ **Free SSL certificates** (automatic HTTPS)
- ✅ **Custom domains** supported
- ✅ **Git-based deployments** (auto-deploy on push)
- ✅ **Environment variables** management
- ✅ **Persistent disks** (1GB free)

### Performance:
- **Cold start**: ~10-30 seconds after inactivity
- **Build time**: ~2-5 minutes
- **Deploy time**: ~1-3 minutes
- **Uptime**: 99.9% SLA

## 🎯 Production Checklist

After deployment, verify:
- [ ] Main page loads at your Render URL
- [ ] All 4 kebab sizes display with measurements
- [ ] All 27 ingredients load correctly
- [ ] Ingredient clicking and selection works
- [ ] Price calculation updates in real-time
- [ ] Kebab preview generates SVG
- [ ] Mobile responsive design works
- [ ] HTTPS certificate is active

## 🔄 Updates & Maintenance

### Auto-Deploy Setup
- ✅ Push to GitHub → Automatic deployment
- ✅ Zero-downtime deployments
- ✅ Rollback capability

### Manual Deploy
1. Go to Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Monitoring
- **Metrics**: CPU, Memory, Response time
- **Logs**: Real-time application logs
- **Alerts**: Email notifications for issues

---

## 🎉 Success!

Your Aslan Food Kebab Builder will be live at:
**https://aslan-food-kebab-builder.onrender.com**

🥙 **Ready to serve kebabs to the world!** 🌍
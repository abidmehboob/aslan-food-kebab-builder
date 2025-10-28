# 🚀 Deployment Guide - Aslan Food Kebab Builder

This guide provides multiple free hosting options for deploying your kebab builder application.

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended) ⭐
**Best for:** Full-stack applications with serverless functions
**Free Tier:** 100GB bandwidth, 1000 serverless function invocations

#### Steps:
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

#### Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
API_PREFIX=/api
API_VERSION=v1
```

### Option 2: Railway 🚂
**Best for:** Full Node.js applications with database
**Free Tier:** $5 credit monthly

#### Steps:
1. Connect GitHub repository to Railway
2. Deploy backend service
3. Add environment variables
4. Deploy frontend as static site

### Option 3: Render.com 🎨
**Best for:** Static sites + API services
**Free Tier:** 750 hours/month

#### Steps:
1. Create Web Service for backend
2. Create Static Site for frontend
3. Link services with environment variables

### Option 4: Netlify + Railway 🔗
**Best for:** Separate frontend/backend deployment
**Free Tiers:** Netlify (100GB), Railway ($5 credit)

## 📁 Project Structure for Deployment

```
aslan-food/
├── backend/
│   ├── server.js          # Main server file
│   ├── api.js            # Serverless entry point
│   ├── package.json      # Backend dependencies
│   └── routes/           # API routes
├── frontend/
│   ├── index.html        # Main application
│   ├── kebab-builder.js  # Frontend logic
│   └── *.html           # Other pages
├── vercel.json          # Vercel configuration
├── railway.json         # Railway configuration
└── .gitignore          # Git ignore file
```

## 🔧 Pre-Deployment Checklist

- [ ] All dependencies listed in package.json
- [ ] Environment variables configured
- [ ] Database connection strings ready (if using database)
- [ ] Frontend API URLs updated for production
- [ ] CORS settings configured for production domain
- [ ] Health check endpoint working (/api/health)

## 🌐 Environment Configuration

### Production Environment Variables:
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=your-strong-jwt-secret-key
API_PREFIX=/api
API_VERSION=v1
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aslan-food
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Development vs Production:
- Development: Uses localhost:3000
- Production: Uses deployed domain
- Database: Local MongoDB vs MongoDB Atlas
- Logging: Console vs File + External service

## 🚀 Quick Start Deployment

### 1. Prepare for Deployment
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && # No build step needed

# Test locally
npm start
```

### 2. Deploy to Vercel (Fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables via Vercel dashboard
```

### 3. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

## 🔍 Post-Deployment Testing

1. **Health Check**: Visit `/api/health`
2. **API Endpoints**: Test `/api/kebab-builder/config`
3. **Frontend**: Verify ingredient loading
4. **Functionality**: Test ingredient selection
5. **Preview**: Test kebab visual preview

## 🐛 Common Deployment Issues

### Issue: API calls failing
**Solution**: Update frontend API base URL to production domain

### Issue: CORS errors
**Solution**: Add production domain to CORS origins

### Issue: Environment variables not working
**Solution**: Verify variable names match exactly in platform settings

### Issue: Serverless timeout
**Solution**: Optimize API response times, reduce payload size

## 📊 Monitoring & Maintenance

- Monitor application logs
- Set up uptime monitoring
- Regular dependency updates
- Database backup (if using database)
- SSL certificate renewal (automatic on most platforms)

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] Main page loads at your domain
- [ ] All 4 kebab sizes display with measurements
- [ ] All 27 ingredients load correctly
- [ ] Ingredient selection works
- [ ] Price calculation functions
- [ ] Kebab preview generates
- [ ] Order functionality works
- [ ] Mobile responsive design works

## 🆘 Support & Resources

- Vercel Documentation: https://vercel.com/docs
- Railway Documentation: https://docs.railway.app
- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/atlas

---

**Ready to deploy?** Choose your preferred platform and follow the steps above! 🚀
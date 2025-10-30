# ✅ Render.com Deployment Checklist

## Pre-Deployment Verification

### Files & Structure
- [ ] `backend/package.json` exists with correct scripts
- [ ] `backend/server.js` exists and serves frontend
- [ ] `frontend/` directory contains all HTML/CSS/JS files
- [ ] `render.yaml` configured for Node.js deployment

### Configuration Files
- [ ] CORS allows all origins in production
- [ ] Server listens on PORT environment variable
- [ ] HOST set to '0.0.0.0' for production
- [ ] Static file serving configured for frontend

### Dependencies
- [ ] All production dependencies in package.json
- [ ] No dev-only dependencies in production build
- [ ] Node.js version >=16.0.0 specified

## Render.com Service Configuration

### Build Settings
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install --production && mkdir -p logs uploads`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: (leave empty)

### Required Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=<generate-secure-32-char-key>
```

### Optional Environment Variables
```bash
API_PREFIX=/api
API_VERSION=v1
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Post-Deployment Testing

### Health Check
- [ ] `https://your-app.onrender.com/api/health` returns OK

### Frontend Pages
- [ ] `https://your-app.onrender.com/` loads main page
- [ ] `https://your-app.onrender.com/frontend/kebab-builder.html` works
- [ ] `https://your-app.onrender.com/frontend/cart.html` works

### API Endpoints
- [ ] `https://your-app.onrender.com/api/v1/ingredients` returns data
- [ ] `https://your-app.onrender.com/api/v1/kebab-builder/config` works
- [ ] CORS allows requests from frontend

### Functionality
- [ ] Ingredient selection works
- [ ] Price calculation updates
- [ ] SVG visualization displays
- [ ] Cart functionality works
- [ ] Mobile responsive design

## Free Tier Considerations

### Limitations
- 750 hours/month (sufficient for most use)
- Sleeps after 15 minutes inactivity (~30 second cold start)
- 512MB RAM limit (app is optimized for this)
- No persistent file storage (uses memory only)

### Optimizations Applied
- [ ] MongoDB optional (works with static data)
- [ ] Memory-efficient image generation
- [ ] Compressed static assets
- [ ] Efficient SVG fallback system

## Troubleshooting

### Common Issues
1. **Build Fails**: Check `backend/package.json` exists
2. **Won't Start**: Verify `JWT_SECRET` environment variable
3. **CORS Errors**: Check production CORS configuration
4. **Static Files**: Verify express.static serves frontend/

### Logs Access
- Render Dashboard → Your Service → Logs tab
- Real-time application logs available

## Success Criteria

✅ **Deployment Complete When:**
- Health endpoint returns 200 OK
- Main kebab builder page loads and functions
- All ingredients display correctly
- Price calculation works in real-time
- SVG visualizations generate properly
- Mobile responsive design works
- HTTPS certificate active

🎯 **Your Aslan Food Kebab Builder is now live on Render.com!**
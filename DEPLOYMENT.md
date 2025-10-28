# Production Deployment Checklist

## ✅ Pre-Deployment

### **Environment Setup**
- [ ] Production environment variables configured in `.env`
- [ ] MongoDB connection string updated for production
- [ ] JWT secret changed from default
- [ ] SSL certificates installed (if using HTTPS)
- [ ] Domain name configured
- [ ] Firewall rules configured

### **Security Configuration**
- [ ] CORS origins updated for production domains
- [ ] Rate limiting configured appropriately
- [ ] Input validation enabled
- [ ] Security headers configured
- [ ] File upload restrictions in place
- [ ] Database credentials secured

### **Performance Optimization**
- [ ] Frontend assets minified and optimized
- [ ] Compression enabled
- [ ] Caching headers configured
- [ ] Database indexes created
- [ ] Log rotation configured

## 🚀 Deployment Steps

### **1. Backup Current System**
```bash
# Create backup of current application
./scripts/deploy.sh production pm2
```

### **2. Deploy Application**
```bash
# Method 1: PM2 (Recommended)
npm run prod

# Method 2: Docker
docker-compose up -d --build

# Method 3: Manual
npm install --production
NODE_ENV=production npm start
```

### **3. Verify Deployment**
```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Check PM2 status
pm2 status

# Check logs
pm2 logs aslan-food-api
```

## 🔍 Post-Deployment Verification

### **Functional Tests**
- [ ] Health check endpoint responds (200 OK)
- [ ] API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Database connections established
- [ ] Authentication system working
- [ ] Order creation and processing works

### **Performance Tests**
- [ ] Response times acceptable (<500ms for API)
- [ ] Memory usage within limits (<500MB)
- [ ] CPU usage normal (<80%)
- [ ] Database queries optimized
- [ ] Static assets served efficiently

### **Security Tests**
- [ ] Rate limiting working
- [ ] Input validation preventing attacks
- [ ] Authentication required for protected routes
- [ ] HTTPS redirect working (if configured)
- [ ] Security headers present

## 📊 Monitoring Setup

### **Application Monitoring**
```bash
# PM2 monitoring
pm2 monit

# Log monitoring
tail -f backend/logs/app.log

# Database monitoring
mongotop --host localhost:27017
```

### **Health Checks**
```bash
# API health check
curl http://localhost:3000/api/health

# Database health
mongo --eval "db.runCommand('ping')"

# Process status
pm2 status
```

## 🚨 Troubleshooting

### **Common Issues**

**Application won't start:**
```bash
# Check logs
pm2 logs
cat backend/logs/error.log

# Check environment variables
printenv | grep NODE_ENV

# Check dependencies
npm ls --depth=0
```

**Database connection issues:**
```bash
# Test MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Check connection string
echo $MONGODB_URI
```

**High memory usage:**
```bash
# Monitor memory
pm2 monit

# Restart with memory limit
pm2 restart aslan-food-api --max-memory-restart 500M
```

### **Rollback Procedure**
```bash
# Stop current application
pm2 stop aslan-food-api

# Restore from backup
cp -r backups/latest/* .

# Restart with previous version
pm2 start ecosystem.config.js
```

## 📈 Performance Optimization

### **Database Optimization**
- Create indexes for frequently queried fields
- Implement connection pooling
- Use aggregation pipelines for complex queries
- Monitor slow queries

### **Application Optimization**
- Enable gzip compression
- Implement caching strategies
- Optimize API responses
- Use CDN for static assets

### **Infrastructure Optimization**
- Configure load balancing
- Implement auto-scaling
- Use reverse proxy (Nginx)
- Set up monitoring and alerting

## 🔐 Security Hardening

### **Server Security**
- Keep Node.js and dependencies updated
- Use non-root user for application
- Configure firewall rules
- Enable fail2ban for SSH protection

### **Application Security**
- Regular security audits
- Dependency vulnerability scanning
- Input validation and sanitization
- Secure session management

### **Database Security**
- Use authentication and authorization
- Encrypt data at rest
- Regular backups
- Network security

## 📋 Maintenance Tasks

### **Daily**
- [ ] Check application logs for errors
- [ ] Monitor resource usage
- [ ] Verify backup completion
- [ ] Check security alerts

### **Weekly**
- [ ] Review performance metrics
- [ ] Update dependencies (patch versions)
- [ ] Clean up old log files
- [ ] Database maintenance

### **Monthly**
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Dependency updates (minor versions)
- [ ] Backup verification

### **Quarterly**
- [ ] Full security assessment
- [ ] Major dependency updates
- [ ] Infrastructure review
- [ ] Disaster recovery testing

---

**✨ Your Aslan Food application is now production-ready!**

For ongoing support and maintenance, refer to the main README.md and monitoring dashboards.
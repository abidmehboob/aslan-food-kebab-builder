# 🚀 Aslan Food - Production Ready Kebab Builder

## Overview
Aslan Food is a production-ready, full-stack kebab builder application featuring an interactive frontend and a robust, scalable backend API. This application has been enhanced with enterprise-level features including comprehensive security, monitoring, database integration, and deployment automation.

## 🏗️ Architecture

### **Backend (Node.js/Express)**
- **Framework**: Express.js with production middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston with structured logging
- **Process Management**: PM2 with cluster mode
- **API Versioning**: RESTful API with v1 versioning

### **Frontend (Vanilla JavaScript)**
- **Interactive UI**: Real-time kebab builder
- **Responsive Design**: Mobile-first approach  
- **Asset Optimization**: Minified JS/CSS/HTML
- **Local Storage**: Persistent cart management
- **Progressive Enhancement**: Works without JavaScript

### **Infrastructure**
- **Containerization**: Docker and Docker Compose
- **Reverse Proxy**: Nginx configuration
- **Process Management**: PM2 ecosystem
- **CI/CD**: Automated deployment scripts
- **Monitoring**: Health checks and logging

## 📋 Features

### **Core Functionality**
- ✅ Interactive kebab builder with 23+ ingredients
- ✅ Real-time price, protein, and weight calculations
- ✅ Single tortilla selection with multiple add-ons
- ✅ Visual kebab preview with ingredient images
- ✅ Persistent shopping cart functionality
- ✅ Order management system

### **Production Features**
- ✅ Comprehensive error handling and logging
- ✅ Rate limiting and DDoS protection
- ✅ Input validation and sanitization
- ✅ Database models with validation
- ✅ JWT authentication system
- ✅ API versioning and documentation
- ✅ Health monitoring endpoints
- ✅ Graceful shutdown handling
- ✅ Asset optimization and caching
- ✅ Security headers and HTTPS ready

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 16+ and npm 8+
- MongoDB 4.4+
- PM2 (for production)
- Docker (optional)

### **Development Setup**

1. **Clone and Install**
```bash
git clone <repository-url>
cd food
npm run install-all
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:3000
- API Health: http://localhost:3000/api/health
- API Docs: http://localhost:3000/api/v1

## 🚀 Production Deployment

### **Method 1: PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Deploy to production
npm run prod

# Monitor processes
pm2 status
pm2 logs
pm2 monit
```

### **Method 2: Docker**
```bash
# Build and run with Docker
docker build -t aslan-food .
docker run -d -p 3000:3000 --name aslan-food aslan-food

# Or use Docker Compose
docker-compose up -d
```

### **Method 3: Automated Deployment**
```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh production pm2

# Deploy with Docker
./scripts/deploy.sh production docker
```

## 🔧 Configuration

### **Environment Variables**
```env
# Server
NODE_ENV=production
PORT=3000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/aslan-food

# Security
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **PM2 Configuration**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'aslan-food-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

## 📊 API Documentation

### **Base URLs**
- Development: `http://localhost:3000/api`
- Production: `https://api.aslanfood.com/api`
- Versioned: `http://localhost:3000/api/v1`

### **Authentication**
```bash
# Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### **Ingredients**
```bash
# Get all ingredients
GET /api/ingredients

# Get ingredients by category
GET /api/ingredients?category=protein
```

### **Kebab Builder**
```bash
# Calculate kebab totals
POST /api/kebab-builder/calculate
{
  "ingredients": [
    {"id": "ingredient_id", "quantity": 1}
  ]
}

# Create order
POST /api/kebab-builder/create
{
  "ingredients": [...],
  "customerInfo": {...}
}
```

### **Orders**
```bash
# Get user orders
GET /api/orders

# Get order by ID
GET /api/orders/:id

# Update order status (admin)
PUT /api/orders/:id/status
```

## 🔐 Security Features

### **Authentication & Authorization**
- JWT tokens with secure headers
- Password hashing with bcrypt
- Account lockout after failed attempts
- Role-based access control

### **Input Validation**
- Express-validator for request validation
- XSS protection with input sanitization
- SQL injection prevention
- File upload restrictions

### **Security Headers**
- Helmet.js for security headers
- CORS configuration
- CSP (Content Security Policy)
- HTTPS enforcement ready

### **Rate Limiting**
- General API rate limiting
- Strict limits for auth endpoints
- DDoS protection
- Request throttling

## 📈 Monitoring & Logging

### **Logging System**
- Winston for structured logging
- Separate error and access logs
- Log rotation and retention
- Request/response logging

### **Health Monitoring**
```bash
# Health check endpoint
GET /api/health

Response:
{
  "status": "OK",
  "environment": "production",
  "database": "connected",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### **Performance Monitoring**
- Request duration tracking
- Memory usage monitoring
- Database connection monitoring
- Error rate tracking

## 🧪 Testing

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Test Structure**
- Unit tests for models and utilities
- Integration tests for API endpoints
- Authentication and authorization tests
- Database operation tests

## 🔄 Backup & Recovery

### **Database Backup**
```bash
# Create database backup
mongodump --host localhost:27017 --db aslan-food --out backups/

# Restore database
mongorestore --host localhost:27017 --db aslan-food backups/aslan-food/
```

### **Application Backup**
- Automated backup before deployments
- Configuration file backups
- Log file retention
- User data backup strategies

## 🚨 Troubleshooting

### **Common Issues**

**1. Database Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI
```

**2. PM2 Process Crashed**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs aslan-food-api

# Restart process
pm2 restart aslan-food-api
```

**3. High Memory Usage**
```bash
# Monitor memory usage
pm2 monit

# Restart with memory limit
pm2 restart aslan-food-api --max-memory-restart 500M
```

### **Performance Optimization**
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use CDN for static assets
- Enable HTTP/2

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1440px+)

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Real-time order tracking
- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Social media integration

### **Technical Improvements**
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] Progressive Web App (PWA)
- [ ] WebSocket real-time updates
- [ ] Machine learning recommendations

## 📞 Support

For technical support and questions:
- **Documentation**: This README and inline code comments
- **Issues**: Create GitHub issues for bugs
- **API Reference**: Available at `/api/v1` endpoint
- **Health Status**: Monitor at `/api/health`

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ by the Aslan Food Team**

*Production-ready since 2025 • Serving delicious kebabs through technology*
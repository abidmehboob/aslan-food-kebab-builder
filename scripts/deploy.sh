#!/bin/bash

# Production Deployment Script for Aslan Food App
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on any error

# Configuration
APP_NAME="aslan-food"
DEFAULT_ENV="production"
ENV=${1:-$DEFAULT_ENV}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 is not installed. Installing PM2..."
        npm install -g pm2
    fi
    
    # Check if Docker is available (optional)
    if command -v docker &> /dev/null; then
        log_info "Docker is available for containerized deployment"
    else
        log_warning "Docker is not available. Skipping container deployment options."
    fi
    
    log_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install root dependencies
    npm install --production
    
    # Install backend dependencies
    cd backend
    npm install --production
    cd ..
    
    log_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    cd backend
    if npm test; then
        log_success "All tests passed"
    else
        log_error "Tests failed. Deployment aborted."
        exit 1
    fi
    cd ..
}

# Build application
build_application() {
    log_info "Building application for $ENV environment..."
    
    # Optimize frontend assets
    npm run optimize-frontend
    
    # Set environment variables
    export NODE_ENV=$ENV
    
    log_success "Application built successfully"
}

# Deploy with PM2
deploy_pm2() {
    log_info "Deploying with PM2..."
    
    # Stop existing processes
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js --env $ENV
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup
    
    log_success "PM2 deployment completed"
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker..."
    
    # Build Docker image
    docker build -t $APP_NAME:latest .
    
    # Stop and remove existing container
    docker stop $APP_NAME 2>/dev/null || true
    docker rm $APP_NAME 2>/dev/null || true
    
    # Run new container
    docker run -d \
        --name $APP_NAME \
        --restart unless-stopped \
        -p 3000:3000 \
        --env-file .env \
        $APP_NAME:latest
    
    log_success "Docker deployment completed"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    log_info "Deploying with Docker Compose..."
    
    # Stop existing services
    docker-compose down
    
    # Build and start services
    docker-compose up -d --build
    
    log_success "Docker Compose deployment completed"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log_success "Health check passed"
            return 0
        fi
        
        log_info "Health check attempt $attempt/$max_attempts failed. Retrying in 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Backup function
backup_previous_version() {
    log_info "Creating backup of previous version..."
    
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup configuration files
    cp -r backend/config "$backup_dir/" 2>/dev/null || true
    cp .env "$backup_dir/" 2>/dev/null || true
    cp ecosystem.config.js "$backup_dir/" 2>/dev/null || true
    
    log_success "Backup created at $backup_dir"
}

# Rollback function
rollback() {
    log_error "Deployment failed. Initiating rollback..."
    
    # Stop current processes
    pm2 stop $APP_NAME 2>/dev/null || true
    
    # Find latest backup
    local latest_backup=$(ls -t backups/ | head -n1)
    
    if [ -n "$latest_backup" ]; then
        log_info "Rolling back to backup: $latest_backup"
        # Restore configuration files
        cp -r "backups/$latest_backup/"* . 2>/dev/null || true
        
        # Restart with previous configuration
        pm2 start ecosystem.config.js --env $ENV
    else
        log_warning "No backup found for rollback"
    fi
    
    exit 1
}

# Main deployment function
main() {
    log_info "Starting deployment for environment: $ENV"
    
    # Set trap for error handling
    trap rollback ERR
    
    # Create backup
    backup_previous_version
    
    # Run deployment steps
    check_prerequisites
    install_dependencies
    
    # Run tests only in production
    if [ "$ENV" = "production" ]; then
        run_tests
    fi
    
    build_application
    
    # Choose deployment method
    case "${2:-pm2}" in
        "pm2")
            deploy_pm2
            ;;
        "docker")
            deploy_docker
            ;;
        "compose")
            deploy_docker_compose
            ;;
        *)
            log_error "Unknown deployment method: $2"
            exit 1
            ;;
    esac
    
    # Health check
    sleep 5  # Give the app time to start
    if health_check; then
        log_success "🎉 Deployment completed successfully!"
        log_info "Application is running at: http://localhost:3000"
        log_info "Health check: http://localhost:3000/api/health"
    else
        log_error "Deployment verification failed"
        exit 1
    fi
}

# Run main function
main "$@"
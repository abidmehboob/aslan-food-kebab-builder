# Production Dockerfile for Aslan Food App
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Set timezone
ENV TZ=America/New_York

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S aslanfood -u 1001

# Backend build stage
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
FROM base AS backend
WORKDIR /app
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY package.json ./

# Copy frontend
COPY frontend ./frontend

# Create necessary directories
RUN mkdir -p logs uploads && \
    chown -R aslanfood:nodejs logs uploads

# Copy environment and config files
COPY .env.example .env.example
COPY ecosystem.config.js ./

# Production stage
FROM base AS production
WORKDIR /app

# Copy application files
COPY --from=backend --chown=aslanfood:nodejs /app ./

# Switch to non-root user
USER aslanfood

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "backend/server.js"]
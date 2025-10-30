#!/usr/bin/env node

/**
 * Render.com Deployment Verification Script
 * Run this locally to verify your app is ready for Render.com deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Render.com deployment readiness...\n');

const checks = [];

// Check 1: Required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'frontend/index.html',
  'frontend/kebab-builder.html',
  'frontend/cart.html',
  'render.yaml'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  checks.push({
    name: `File exists: ${file}`,
    passed: exists,
    required: true
  });
});

// Check 2: Package.json configuration
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json'), 'utf8'));
  
  checks.push({
    name: 'Has start script',
    passed: pkg.scripts && pkg.scripts.start,
    required: true
  });
  
  checks.push({
    name: 'Node version specified',
    passed: pkg.engines && pkg.engines.node,
    required: false
  });
  
  checks.push({
    name: 'Express dependency',
    passed: pkg.dependencies && pkg.dependencies.express,
    required: true
  });
  
} catch (error) {
  checks.push({
    name: 'Package.json valid JSON',
    passed: false,
    required: true,
    error: error.message
  });
}

// Check 3: Server.js configuration
try {
  const serverContent = fs.readFileSync(path.join(__dirname, 'backend/server.js'), 'utf8');
  
  checks.push({
    name: 'Server uses PORT env variable',
    passed: serverContent.includes('process.env.PORT') || serverContent.includes('config.PORT'),
    required: true
  });
  
  checks.push({
    name: 'CORS configured',
    passed: serverContent.includes('cors'),
    required: true
  });
  
  checks.push({
    name: 'Static files served',
    passed: serverContent.includes('express.static'),
    required: true
  });
  
  checks.push({
    name: 'Health check endpoint',
    passed: serverContent.includes('/api/health'),
    required: true
  });
  
} catch (error) {
  checks.push({
    name: 'Server.js readable',
    passed: false,
    required: true,
    error: error.message
  });
}

// Check 4: Render.yaml configuration
try {
  const renderConfig = fs.readFileSync(path.join(__dirname, 'render.yaml'), 'utf8');
  
  checks.push({
    name: 'Render.yaml configured',
    passed: renderConfig.includes('type: web') && renderConfig.includes('env: node'),
    required: true
  });
  
} catch (error) {
  checks.push({
    name: 'Render.yaml exists',
    passed: false,
    required: false,
    error: error.message
  });
}

// Display results
console.log('📋 Deployment Readiness Report:\n');

let requiredPassed = 0;
let requiredTotal = 0;
let optionalPassed = 0;
let optionalTotal = 0;

checks.forEach(check => {
  const icon = check.passed ? '✅' : '❌';
  const type = check.required ? 'REQUIRED' : 'OPTIONAL';
  
  console.log(`${icon} [${type}] ${check.name}`);
  if (check.error) {
    console.log(`    Error: ${check.error}`);
  }
  
  if (check.required) {
    requiredTotal++;
    if (check.passed) requiredPassed++;
  } else {
    optionalTotal++;
    if (check.passed) optionalPassed++;
  }
});

console.log('\n📊 Summary:');
console.log(`Required checks: ${requiredPassed}/${requiredTotal} passed`);
console.log(`Optional checks: ${optionalPassed}/${optionalTotal} passed`);

const readyForDeployment = requiredPassed === requiredTotal;

if (readyForDeployment) {
  console.log('\n🎉 Ready for Render.com deployment!');
  console.log('\nNext steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Create Web Service on Render.com');
  console.log('3. Set environment variables:');
  console.log('   - NODE_ENV=production');
  console.log('   - JWT_SECRET=your-secure-secret');
  console.log('4. Deploy and test!');
} else {
  console.log('\n⚠️  Please fix required issues before deployment.');
  process.exit(1);
}
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier');

const frontendPath = path.join(__dirname, '..', 'frontend');
const distPath = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Optimize JavaScript files
async function optimizeJS() {
  console.log('🔨 Optimizing JavaScript files...');
  
  const jsFiles = fs.readdirSync(frontendPath).filter(file => file.endsWith('.js'));
  
  for (const file of jsFiles) {
    const filePath = path.join(frontendPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const result = await minify(content, {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        mangle: true,
        format: {
          comments: false
        }
      });
      
      const outputPath = path.join(distPath, file);
      fs.writeFileSync(outputPath, result.code);
      
      const originalSize = (content.length / 1024).toFixed(2);
      const minifiedSize = (result.code.length / 1024).toFixed(2);
      const savings = (((content.length - result.code.length) / content.length) * 100).toFixed(1);
      
      console.log(`✅ ${file}: ${originalSize}KB → ${minifiedSize}KB (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);
    }
  }
}

// Optimize CSS files
function optimizeCSS() {
  console.log('🎨 Optimizing CSS files...');
  
  const cssFiles = fs.readdirSync(frontendPath).filter(file => file.endsWith('.css'));
  const cleanCSS = new CleanCSS({
    level: 2,
    format: 'beautify'
  });
  
  for (const file of cssFiles) {
    const filePath = path.join(frontendPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const result = cleanCSS.minify(content);
    
    if (result.errors.length === 0) {
      const outputPath = path.join(distPath, file);
      fs.writeFileSync(outputPath, result.styles);
      
      const originalSize = (content.length / 1024).toFixed(2);
      const minifiedSize = (result.styles.length / 1024).toFixed(2);
      const savings = (((content.length - result.styles.length) / content.length) * 100).toFixed(1);
      
      console.log(`✅ ${file}: ${originalSize}KB → ${minifiedSize}KB (${savings}% smaller)`);
    } else {
      console.error(`❌ Error optimizing ${file}:`, result.errors);
    }
  }
}

// Optimize HTML files
function optimizeHTML() {
  console.log('📄 Optimizing HTML files...');
  
  const htmlFiles = fs.readdirSync(frontendPath).filter(file => file.endsWith('.html'));
  
  for (const file of htmlFiles) {
    const filePath = path.join(frontendPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const result = minifyHTML(content, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      });
      
      const outputPath = path.join(distPath, file);
      fs.writeFileSync(outputPath, result);
      
      const originalSize = (content.length / 1024).toFixed(2);
      const minifiedSize = (result.length / 1024).toFixed(2);
      const savings = (((content.length - result.length) / content.length) * 100).toFixed(1);
      
      console.log(`✅ ${file}: ${originalSize}KB → ${minifiedSize}KB (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);
    }
  }
}

// Copy other assets
function copyAssets() {
  console.log('📁 Copying other assets...');
  
  const files = fs.readdirSync(frontendPath);
  const excludeExtensions = ['.js', '.css', '.html'];
  
  files.forEach(file => {
    const ext = path.extname(file);
    if (!excludeExtensions.includes(ext)) {
      const sourcePath = path.join(frontendPath, file);
      const destPath = path.join(distPath, file);
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file}`);
    }
  });
}

// Main optimization function
async function optimize() {
  console.log('🚀 Starting frontend optimization...\n');
  
  try {
    await optimizeJS();
    console.log('');
    
    optimizeCSS();
    console.log('');
    
    optimizeHTML();
    console.log('');
    
    copyAssets();
    console.log('');
    
    console.log('✨ Frontend optimization completed successfully!');
    console.log(`📦 Optimized files saved to: ${distPath}`);
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Run optimization if this script is executed directly
if (require.main === module) {
  optimize();
}

module.exports = { optimize };
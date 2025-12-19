#!/usr/bin/env node

// Verify Prisma setup script
console.log('🔍 Checking Prisma setup...');

try {
  const path = require('path');
  const fs = require('fs');
  
  // Check if Prisma client exists
  const prismaPath = path.join(__dirname, 'src', 'generated', 'prisma');
  
  if (fs.existsSync(prismaPath)) {
    console.log('✅ Prisma client generated successfully');
    
    // List generated files
    const files = fs.readdirSync(prismaPath);
    console.log(`📁 Generated files: ${files.length}`);
    
    // Check for essential files
    const essentialFiles = ['index.js', 'client.js', 'schema.prisma'];
    const missingFiles = essentialFiles.filter(file => !files.includes(file));
    
    if (missingFiles.length === 0) {
      console.log('✅ All essential Prisma files present');
    } else {
      console.log(`⚠️  Missing files: ${missingFiles.join(', ')}`);
    }
  } else {
    console.log('❌ Prisma client not found. Run: npm run db:generate');
  }
  
  // Check package.json scripts
  const packageJson = require('./package.json');
  const scripts = packageJson.scripts;
  
  if (scripts.postinstall && scripts.postinstall.includes('prisma generate')) {
    console.log('✅ postinstall script configured');
  } else {
    console.log('⚠️  postinstall script missing or incorrect');
  }
  
  if (scripts.build && scripts.build.includes('prisma generate')) {
    console.log('✅ build script configured');
  } else {
    console.log('⚠️  build script missing prisma generate');
  }
  
  console.log('🎉 Setup verification complete!');
  
} catch (error) {
  console.error('❌ Error during verification:', error.message);
}
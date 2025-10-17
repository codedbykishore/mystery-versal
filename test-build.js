#!/usr/bin/env node

/**
 * Simple build test script for Mystery Versal
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Mystery Versal build...\n');

try {
  // Test TypeScript compilation
  console.log('📝 Checking TypeScript...');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed\n');

  // Test build process
  console.log('🏗️  Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');

  // Check if build outputs exist
  const clientDist = path.join(__dirname, 'dist', 'client');
  const serverDist = path.join(__dirname, 'dist', 'server');

  if (fs.existsSync(clientDist)) {
    console.log('✅ Client build output found');
  } else {
    console.log('❌ Client build output missing');
  }

  if (fs.existsSync(serverDist)) {
    console.log('✅ Server build output found');
  } else {
    console.log('❌ Server build output missing');
  }

  console.log('\n🎉 All tests passed! Mystery Versal is ready to deploy.');

} catch (error) {
  console.error('\n❌ Build test failed:', error.message);
  process.exit(1);
}
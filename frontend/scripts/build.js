#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔨 Starting build process...');

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('prisma generate', { stdio: 'inherit' });

  // Step 2: Run migrations (only on Vercel/production with database)
  if (process.env.VERCEL || process.env.DATABASE_URL) {
    console.log('🗄️  Deploying database migrations...');
    try {
      execSync('prisma migrate deploy --skip-generate', { stdio: 'inherit' });
      console.log('✅ Migrations deployed successfully');
    } catch (error) {
      console.warn('⚠️  Migration deployment skipped (no database or already up to date)');
    }
  } else {
    console.log('⏭️  Skipping migrations (local development)');
  }

  // Step 3: Build Next.js
  console.log('🏗️  Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

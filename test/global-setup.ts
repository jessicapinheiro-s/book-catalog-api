import { execSync } from 'child_process';
import 'dotenv/config';

export default function () {
  console.log('🚀 Starting global test setup...');

  try {
    console.log('📦 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated successfully!');

    console.log('🗄️  Preparing test database...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    console.log('✅ Test database ready!');
    return new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    process.exit(1);
  }
}
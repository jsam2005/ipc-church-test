import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Fixing GitHub Pages deployment...');
console.log('====================================\n');

try {
  // Step 1: Build with correct base path
  console.log('📦 Building project with correct base path...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');

  // Step 2: Switch to gh-pages branch
  console.log('🌿 Switching to gh-pages branch...');
  execSync('git checkout gh-pages', { stdio: 'inherit' });

  // Step 3: Remove old files
  console.log('🗑️  Removing old files...');
  const filesToRemove = ['assets', 'dist', 'index.html', 'vite.svg'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        fs.rmSync(file, { recursive: true });
      } else {
        fs.unlinkSync(file);
      }
    }
  });

  // Step 4: Copy new dist files
  console.log('📁 Copying new dist files...');
  const distPath = path.join(process.cwd(), 'dist');
  const files = fs.readdirSync(distPath);
  
  files.forEach(file => {
    const srcPath = path.join(distPath, file);
    const destPath = path.join(process.cwd(), file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true });
      }
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Step 5: Create .nojekyll file
  console.log('📄 Creating .nojekyll file...');
  fs.writeFileSync('.nojekyll', '');

  // Step 6: Add and commit
  console.log('💾 Adding files to git...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('📝 Committing changes...');
  execSync('git commit -m "Fix GitHub Pages asset paths"', { stdio: 'inherit' });

  // Step 7: Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin gh-pages', { stdio: 'inherit' });

  console.log('\n✅ GitHub Pages deployment fixed!');
  console.log('🌐 Your church test should now work at:');
  console.log('   https://jsam2005.github.io/ipc-church-test/');
  console.log('\n📱 For your 30 church members:');
  console.log('   - Professional church website ✅');
  console.log('   - Fair testing (shuffled questions) ✅');
  console.log('   - Mobile optimized ✅');
  console.log('   - Completely FREE ✅');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n📖 Manual fix steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: git checkout gh-pages');
  console.log('3. Copy dist/* files to root');
  console.log('4. Run: git add .');
  console.log('5. Run: git commit -m "Fix asset paths"');
  console.log('6. Run: git push origin gh-pages');
}

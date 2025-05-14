const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Install root dependencies
console.log('Installing root dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Install and build client
console.log('Installing client dependencies...');
process.chdir('client');
execSync('npm install', { stdio: 'inherit' });

console.log('Building client...');
execSync('npm run build', { stdio: 'inherit' });
process.chdir('..');

// Install server dependencies
console.log('Installing server dependencies...');
process.chdir('server');
execSync('npm install', { stdio: 'inherit' });
process.chdir('..');

// Copy client build to server directory
console.log('Copying client build to server directory...');
const sourceDir = path.join(__dirname, 'dist');
const destDir = path.join(__dirname, 'server', 'dist');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (fs.existsSync(sourceDir)) {
  copyRecursiveSync(sourceDir, destDir);
  console.log('Build files copied successfully!');
} else {
  console.error('Error: Build directory not found');
  process.exit(1);
}

console.log('Build process completed successfully!');

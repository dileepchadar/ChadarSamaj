const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src/app', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace imports
    content = content.replace(/from\s+['"](?:\.\.\/)+components\/(.*?)['"]/g, "from '@/components/$1'");
    content = content.replace(/from\s+['"](?:\.\.\/)+context\/(.*?)['"]/g, "from '@/context/$1'");
    content = content.replace(/from\s+['"](?:\.\.\/)+api(?:\.js)?['"]/g, "from '@/api'");
    content = content.replace(/from\s+['"](?:\.\.\/)+assets\/(.*?)['"]/g, "from '@/assets/$1'");

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});

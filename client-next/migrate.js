const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add "use client"
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      content = '"use client";\n' + content;
    }

    // Replace React Router imports
    // 1. replace `useNavigate` and `useParams`
    if (content.includes('react-router-dom')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
        let navigationImports = [];
        let nextLink = false;
        
        imports.split(',').forEach(imp => {
          let i = imp.trim();
          if (i === 'Link') nextLink = true;
          else if (i === 'useNavigate') navigationImports.push('useRouter');
          else if (i === 'useParams') navigationImports.push('useParams');
          else if (i === 'useSearchParams') navigationImports.push('useSearchParams');
        });

        let res = '';
        if (nextLink) res += "import Link from 'next/link';\n";
        if (navigationImports.length > 0) {
          res += `import { ${navigationImports.join(', ')} } from 'next/navigation';\n`;
        }
        return res;
      });

      // Replace useNavigate with useRouter
      content = content.replace(/useNavigate\(\)/g, 'useRouter()');
      content = content.replace(/const\s+navigate\s*=\s*useRouter\(\)/g, 'const router = useRouter()');
      content = content.replace(/navigate\(/g, 'router.push(');
    }
    
    fs.writeFileSync(filePath, content);
  }
});

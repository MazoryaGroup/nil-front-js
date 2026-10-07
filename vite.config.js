import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ============================================
// پلاگین کپی فایل‌های اضافی به dist
// ============================================
function copyExtraAssets() {
  return {
    name: 'copy-extra-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!existsSync(distDir)) mkdirSync(distDir);

      // ✅ کپی پوشه lang
      const langSrc = resolve(__dirname, 'lang');
      const langDest = resolve(distDir, 'lang');
      if (existsSync(langSrc)) {
        copyDir(langSrc, langDest);
        console.log('✅ lang/ copied to dist/');
      }

      // ✅ کپی پوشه‌های Webflow (تصاویر)
      const webflowFolders = [
        '664f4bd2faa9dcaac5fc2dee',
        '66b9c720ca349144caf447a8'
      ];

      webflowFolders.forEach(folder => {
        const src = resolve(__dirname, folder);
        const dest = resolve(distDir, folder);
        if (existsSync(src)) {
          copyDir(src, dest);
          console.log(`✅ ${folder} copied to dist/`);
        }
      });

      // ✅ کپی فایل‌های ریشه (SVG, PNG, JPG)
      const rootFiles = readdirSync(__dirname).filter(f => {
        return /\.(svg|png|jpg|jpeg|webp|gif|ico)$/i.test(f);
      });

      rootFiles.forEach(file => {
        copyFileSync(resolve(__dirname, file), resolve(distDir, file));
      });
      if (rootFiles.length) {
        console.log(`✅ ${rootFiles.length} root images copied to dist/`);
      }
    }
  };
}

function copyDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// ============================================
// تنظیمات Vite
// ============================================
export default defineConfig({
  root: '.',
  publicDir: 'asset',
  plugins: [copyExtraAssets()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // ✅ API Laravel
      '/api': {
        target: 'http://localhost/nil-back/public',
        changeOrigin: true,
        secure: false
      },

      // ✅ Storage (عکس‌ها)
      '/storage': {
        target: 'http://localhost/nil-back/public',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});

import { defineConfig } from 'vite';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync
} from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================
// Backend Laravel - Laragon
// ============================================

const BACKEND_URL = 'http://nil-back.test';

// ============================================
// Copy Directory
// ============================================

function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  for (const entry of readdirSync(src)) {
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
// Copy Extra Assets Plugin
// ============================================

function copyExtraAssets() {
  return {
    name: 'copy-extra-assets',

    closeBundle() {
      const distDir = resolve(__dirname, 'dist');

      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      // Copy Languages
      const langSrc = resolve(__dirname, 'lang');
      const langDest = resolve(distDir, 'lang');

      if (existsSync(langSrc)) {
        copyDir(langSrc, langDest);
        console.log('✅ lang/ copied to dist/');
      }

      // Copy Webflow Assets
      const webflowFolders = [
        '664f4bd2faa9dcaac5fc2dee',
        '66b9c720ca349144caf447a8'
      ];

      for (const folder of webflowFolders) {
        const src = resolve(__dirname, folder);
        const dest = resolve(distDir, folder);

        if (existsSync(src)) {
          copyDir(src, dest);
          console.log(`✅ ${folder} copied to dist/`);
        }
      }

      // Copy Root Images
      const rootFiles = readdirSync(__dirname).filter(file =>
        /\.(svg|png|jpg|jpeg|webp|gif|ico)$/i.test(file)
      );

      for (const file of rootFiles) {
        copyFileSync(
          resolve(__dirname, file),
          resolve(distDir, file)
        );
      }

      if (rootFiles.length) {
        console.log(
          `✅ ${rootFiles.length} root images copied to dist/`
        );
      }
    }
  };
}

// ============================================
// Vite Configuration
// ============================================

export default defineConfig({
  root: '.',

  publicDir: 'asset',

  plugins: [
    copyExtraAssets()
  ],

  server: {
    host: 'localhost',
    port: 3000,
    open: true,

    proxy: {
      // Laravel API
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false
      },

      // Laravel Storage
      '/storage': {
        target: BACKEND_URL,
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

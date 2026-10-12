
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

// ============================================
// Project Root
// ============================================

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================
// Backend Laravel - Laragon
// ============================================

const BACKEND_URL = 'http://nil-back.test';

// ============================================
// Copy Directory Recursively
// ============================================

function copyDir(src, dest) {
  if (!existsSync(src)) {
    return;
  }

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
    apply: 'build',

    closeBundle() {
      const distDir = resolve(__dirname, 'dist');

      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      // ========================================
      // Copy Languages
      // ========================================

      const langSrc = resolve(__dirname, 'lang');
      const langDest = resolve(distDir, 'lang');

      if (existsSync(langSrc)) {
        copyDir(langSrc, langDest);
        console.log('✅ lang/ copied to dist/');
      } else {
        console.warn('⚠️ lang/ folder not found');
      }

      // ========================================
      // Copy NIL Offline Finance
      // ========================================

      const offlineSrc = resolve(__dirname, 'nil-offline');
      const offlineDest = resolve(distDir, 'nil-offline');

      if (existsSync(offlineSrc)) {
        copyDir(offlineSrc, offlineDest);
        console.log('✅ nil-offline/ copied to dist/');
      } else {
        console.warn('⚠️ nil-offline/ folder not found');
      }

      // ========================================
      // Copy Webflow Assets
      // ========================================

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
        } else {
          console.warn(`⚠️ ${folder}/ not found`);
        }
      }

      // ========================================
      // Copy Root Images
      // ========================================

      const rootFiles = readdirSync(__dirname).filter(file =>
        /\.(svg|png|jpg|jpeg|webp|gif|ico)$/i.test(file)
      );

      for (const file of rootFiles) {
        copyFileSync(
          resolve(__dirname, file),
          resolve(distDir, file)
        );
      }

      if (rootFiles.length > 0) {
        console.log(
          `✅ ${rootFiles.length} root images copied to dist/`
        );
      }

      // ========================================
      // Build Completed
      // ========================================

      console.log('====================================');
      console.log('✅ NIL BEAUTY BUILD ASSETS READY');
      console.log('====================================');
    }
  };
}

// ============================================
// Vite Configuration
// ============================================

export default defineConfig({
  // ==========================================
  // Root
  // ==========================================

  root: '.',

  // ==========================================
  // Public Assets
  // ==========================================

  publicDir: 'asset',

  // ==========================================
  // Plugins
  // ==========================================

  plugins: [
    copyExtraAssets()
  ],

  // ==========================================
  // Development Server
  // ==========================================

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

  // ==========================================
  // Production Build
  // ==========================================

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

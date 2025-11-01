import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Relative paths for portable deployment
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined // Single bundle for small project
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './', // or the appropriate path for your deployment
  plugins: [react()],
  esbuild: {
    logLevel: 'silent', // Suppress esbuild warnings and logs
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/inventec-8d-simulator/',
  plugins: [react()],
});


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
  },
  build: {
    outDir: 'build', // 빌드 결과물을 'build' 폴더에 생성
  },
});

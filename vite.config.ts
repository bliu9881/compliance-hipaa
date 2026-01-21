import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    
    console.log('🔧 Vite Config - Environment Variables:');
    console.log('VITE_GEMINI_API_KEY present:', !!env.VITE_GEMINI_API_KEY);
    console.log('AWS credentials will be handled server-side for security');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

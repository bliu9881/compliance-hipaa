import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // AWS credentials for Bedrock
    const awsAccessKeyId = env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    const awsRegion = env.AWS_REGION || process.env.AWS_REGION || 'us-east-1';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Keep Gemini for backward compatibility
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // Add AWS credentials for Bedrock
        'process.env.AWS_ACCESS_KEY_ID': JSON.stringify(awsAccessKeyId),
        'process.env.AWS_SECRET_ACCESS_KEY': JSON.stringify(awsSecretAccessKey),
        'process.env.AWS_REGION': JSON.stringify(awsRegion)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

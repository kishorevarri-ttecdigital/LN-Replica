import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    export default defineConfig({
      server: {
        host: "0.0.0.0",    
        port: 8080,
        allowedHosts: ['ln-rfp-ai-assistant-frontend-dev-1089873937305.us-central1.run.app'],
      },
      preview: {
        port: 4173
      },
      plugins: [react()],
    });
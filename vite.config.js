import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    export default defineConfig({
      server: {
        host: "0.0.0.0",    
        port: 8080,
        allowedHosts: ['ln-replica-151472627439.us-central1.run.app'],
      },
      preview: {
        port: 4173
      },
      plugins: [react()],
    });
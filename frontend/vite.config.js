import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    server: {
      port: parseInt(env.VITE_PORT) || 3001,
      host: env.VITE_HOST || 'localhost'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})

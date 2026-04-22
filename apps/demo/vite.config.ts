import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@agent-skills-dashboard/react/styles',
        replacement: fileURLToPath(new URL('../../packages/react/src/styles.css', import.meta.url)),
      },
      {
        find: '@agent-skills-dashboard/core',
        replacement: fileURLToPath(new URL('./src/core-browser.ts', import.meta.url)),
      },
      {
        find: '@agent-skills-dashboard/react',
        replacement: fileURLToPath(new URL('../../packages/react/src/index.ts', import.meta.url)),
      },
    ],
  },
});

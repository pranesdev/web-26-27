import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://astro.build/config
export default defineConfig({
  publicDir: 'assets',
  integrations: [
    react()
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Serve src/public as additional static assets (e.g. /logo/club-logo.png)
      viteStaticCopy({
        targets: [
          { src: 'src/public/**/*', dest: '' }
        ]
      })
    ]
  }
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://davidbrianethier.com',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    }
  }
});

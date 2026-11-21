import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.paroquiaponte.com.br',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});

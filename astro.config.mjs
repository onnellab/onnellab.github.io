import { defineConfig } from 'astro/config';
import { staticImageBoundary, staticImageServiceEntrypoint } from './scripts/static-image-service.mjs';

export default defineConfig({
  site: 'https://onnellab.com',
  output: 'static',
  cacheDir: './node_modules/.astro-static-no-images',
  trailingSlash: 'always',
  image: { service: { entrypoint: staticImageServiceEntrypoint } },
  integrations: [staticImageBoundary()]
});

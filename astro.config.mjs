// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://saltandsuntours.com.na',
  integrations: [
    sitemap({
      // Internal design-preview pages — real content lives nowhere near
      // these, so they'd only ever show up in search results as
      // confusing noise.
      filter: (page) => !page.includes('/preview-'),
    }),
  ],
});

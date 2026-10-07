import { defineConfig } from 'vite';

// Local video files can change in place while designing the site. Avoid keeping
// partial MP4 responses in Chrome's disk cache across those changes.
const localHeaders = { 'Cache-Control': 'no-store' };

export default defineConfig({
  server: { headers: localHeaders },
  preview: { headers: localHeaders },
});

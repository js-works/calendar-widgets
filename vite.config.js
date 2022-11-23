import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    open: '/src/stories/demo/demo.html'
  },
  resolve: {
    alias: {
      '@shoelace-style/shoelace/dist/react':
        '../../node_modules/@shoelace-style/shoelace/dist/react/index.js'
    }
  }
});

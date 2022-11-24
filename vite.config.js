import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    open: '/src/stories/demo/demo.html'
  },
  resolve: {
    alias: {
      '@shoelace-style/shoelace/dist/react':
        '../../node_modules/@shoelace-style/shoelace/dist/react/index.js',
      'shoelace-widgets/internal': '/src/main/shoelace-widgets-internal.ts',
      'shoelace-widgets': '/src/main/shoelace-widgets.ts'
    }
  }
});

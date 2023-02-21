import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4444,
    open: '/src/demos/demo-app/demo-app.html'
  },
  resolve: {
    alias: {
      '@shoelace-style/shoelace/dist/react':
        '../../node_modules/@shoelace-style/shoelace/dist/react/index.js',
      '@shoelace-style/shoelace/dist/internal/form':
        '../../node_modules/@shoelace-style/shoelace/dist/internal/form.js',
      'shoelace-widgets/lit': '/src/main/shoelace-widgets-lit.ts',
      'shoelace-widgets/internal': '/src/main/shoelace-widgets-internal.ts',
      'shoelace-widgets': '/src/main/shoelace-widgets.ts'
    }
  }
});

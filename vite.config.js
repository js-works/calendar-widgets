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
      'shoelace-elements/lit': '/src/main/shoelace-elements-lit.ts',
      'shoelace-elements/plugins': '/src/main/shoelace-elements-plugins.ts',
      'shoelace-elements/internal': '/src/main/shoelace-elements-internal.ts',
      'shoelace-elements': '/src/main/shoelace-elements.ts'
    }
  }
});

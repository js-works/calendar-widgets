import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    open: '/src/stories/demo/demo.html'
  },
  resolve: {
    alias: {
      'lit/decorators': '../../node_modules/lit/decorators.js',
      'lit/directives/class-map':
        '../../node_modules/lit/directives/class-map.js',
      'lit/directives/style-map':
        '../../node_modules/lit/directives/style-map.js',
      'lit/directives/ref': '../../node_modules/lit/directives/ref.js',
      'lit/directives/repeat': '../../node_modules/lit/directives/repeat.js',
      'lit/directives/unsafe-html':
        '../../node_modules/lit/directives/unsafe-html.js',
      'lit/directives/when': '../../node_modules/lit/directives/when.js',
      '@shoelace-style/shoelace/dist/react':
        '../../node_modules/@shoelace-style/shoelace/dist/react.js'
    }
  }
});

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      },
      extensions: ['.svelte']
    }),
    svelte({
      compilerOptions: {
        customElement: false
      },
      extensions: ['.svelte.fragment']
    }),
  ]
})

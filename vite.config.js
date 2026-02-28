import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'

// JSONC loader plugin
function jsoncPlugin() {
  return {
    name: 'jsonc-loader',
    transform(code, id) {
      if (id.endsWith('.jsonc')) {
        // Remove single-line comments and multi-line comments
        const jsonString = code
          .replace(/\/\/.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
        try {
          const parsed = JSON.parse(jsonString)
          return {
            code: `export default ${JSON.stringify(parsed)}`,
            map: null
          }
        } catch (e) {
          console.error(`Error parsing JSONC file: ${id}`, e)
          throw e
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), jsoncPlugin()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
})

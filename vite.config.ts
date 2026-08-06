import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync, existsSync, statSync } from 'fs'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 静态资源服务插件
function staticServePlugin() {
  const staticDir = resolve(__dirname, 'docs/技术分享PPT/ecdp-structure-first')
  return {
    name: 'static-serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/ecdp-structure-first/')) {
          next()
          return
        }
        const filePath = resolve(staticDir, req.url.replace('/ecdp-structure-first/', ''))
        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          next()
          return
        }
        const content = readFileSync(filePath)
        const ext = filePath.split('.').pop() || ''
        const mimeTypes: Record<string, string> = {
          html: 'text/html',
          css: 'text/css',
          js: 'application/javascript',
          png: 'image/png',
          jpg: 'image/jpeg',
          svg: 'image/svg+xml',
          json: 'application/json',
          woff: 'font/woff',
          woff2: 'font/woff2',
          ttf: 'font/ttf',
          eot: 'application/vnd.ms-fontobject'
        }
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
        res.end(content)
      })
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    staticServePlugin(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: false
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'echarts': ['echarts'],
          'editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
          'datav': ['@kjgl77/datav-vue3', 'datav-vue3']
        }
      }
    }
  }
})

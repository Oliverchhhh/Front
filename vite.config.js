import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicPath: '/static/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
devServer:{
  port:8080,
  host:'127.0.0.1',
  open:true,
  https:false,
  proxy:{
    "/":{
      target:"http://127.0.0.1:24109",
      ws:true,
      changeOrigin:true,
      pathRewrite:{
        "^/api":""
      }
    }
  }

}
})

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // チャンクサイズ警告の閾値を変更
    chunkSizeWarningLimit: 5000,  // 例えば、2MBに設定。デフォルトは500KB

    // 手動でチャンクを分割する設定
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules 以下のライブラリを 'vendor' チャンクにまとめる
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // 他にも分割したいライブラリがあれば、ここで条件を追加できます
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cocktify',
        short_name: 'Cocktify',
        description: 'Cocktail App built with React and Vite',
        theme_color: '#181F27',
        background_color: '#181F27',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  define: {
    'global': 'window',  // ブラウザ環境で `global` を `window` に設定
  },
  // server: {
  //   https: true
  // }
})


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import tsconfigPaths from "vite-tsconfig-paths";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// });

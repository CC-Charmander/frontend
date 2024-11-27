import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB に設定
      },
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
    global: 'window'
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

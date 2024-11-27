import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  }
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

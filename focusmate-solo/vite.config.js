import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    // Proxy /api calls to Vercel in local dev
    proxy: {
      "/api": {
        target: "https://focusmate-solo.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

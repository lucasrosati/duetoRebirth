import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  server: {
    proxy: {
      "/palavras": "http://localhost:8888",
      "/tentativa": "http://localhost:8888",
      "/ranking"  : "http://localhost:8888"
    }
  }
});

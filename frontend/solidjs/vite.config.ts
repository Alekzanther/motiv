import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  server: {
    proxy: {
      "/m": {
        target: "http://0.0.0.0:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});

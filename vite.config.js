import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Pre-bundling these avoids Vite's "optimized deps changed, reloading" blank first load.
export default defineConfig({ plugins: [react()], optimizeDeps: { include: ["react", "react-dom/client", "react-router-dom"] } });

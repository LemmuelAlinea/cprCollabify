import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config for the Collabify SPA.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

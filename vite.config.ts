import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/src",
      },
      {
        // inisiasi pemanggilan package yang akan dipakai
        find: "@threads",
        replacement: "/src/features/threads",
      },
    ],
  },
});

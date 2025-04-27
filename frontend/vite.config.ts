import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', "serif"], // or whatever font you picked
      },
    },
  },
  plugins: [react(), tailwindcss()],
});

import { defineConfig } from "vite";

export default defineConfig({
  base: "/luna-adventures/",
  server: {
    port: 5173,
  },
  build: {
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/game/logic/__tests__/**/*.test.ts"],
  },
});

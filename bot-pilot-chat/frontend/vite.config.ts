// https://vite.dev/config/
import { defineConfig } from "vite";
export default defineConfig({
  //plugins: [react(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: "3000",
  },
});

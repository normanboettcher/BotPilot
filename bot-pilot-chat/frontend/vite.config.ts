// https://vite.dev/config/
import { defineConfig } from 'vite';

const getTarget = () => {
  const env = process.env.NODE_ENV;
  if (env === 'local') {
    return 'http://localhost:5005/';
  }
  if (env === 'dev') {
    return 'https://dev.staging.bot-pilot.de';
  }
};

const getCalendarApiTarget = () => {
  const env = process.env.NODE_ENV;
  if (env === 'local') {
    return 'http://bot-connectors:8000/';
  }
  if (env === 'dev') {
    return 'http://dev.staging.bot-pilot.de:8000/';
  }
};

export default defineConfig({
  //plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: getTarget(),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/calendar': {
        target: getCalendarApiTarget(),
        changeOrigin: true,
      },
    },
  },
});

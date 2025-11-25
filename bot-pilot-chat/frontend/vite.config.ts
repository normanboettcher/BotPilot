// https://vite.dev/config/
import { defineConfig } from 'vite';

const getTarget = () => {
	const env = process.env.NODE_ENV
	console.log(`env: [${env}]`)
	if(env === 'local') {
		return 'http://localhost:5005/'
		}
	}

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
		  target: 'http://localhost:8000',
		  changeOrigin: true,
	  }
    },
  },
});

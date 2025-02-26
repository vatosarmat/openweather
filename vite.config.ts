import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // console.log(env);

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    define: {
      OPENWEATHER_APPID: JSON.stringify(env.APP_ENV),
    },
    server: {
      ...(env.ALLOWED_HOSTS
        ? { allowedHosts: env.ALLOWED_HOSTS.split(',') }
        : {}),
    },
  };
});

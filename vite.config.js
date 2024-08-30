import { defineConfig, loadEnv } from 'vite';
import tailwindcss from 'tailwindcss';
import createVitePlugins from './vite/plugins';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'));
  return {
    envDir: './env', // 自定义env目录
    plugins: createVitePlugins(),
    css: {
      postcss: {
        plugins: [tailwindcss]
      }
    },
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src')
      }
    },
    // 服务代理
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(env.VITE_APP_PORT, 10),
      proxy: {
        [env['VITE_PROXY_PREFIX']]: {
          target: env['VITE_API_BASE_URL'],
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(`^${env['VITE_PROXY_PREFIX']}`), '')
        }
      }
    }
  };
});

import { reactRouter } from '@react-router/dev/vite';
import { UserConfig, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    commonjs(),
  ] as UserConfig['plugins'],
  ssr: {
    external: ['rxjs'],
  },
  build: {
    rollupOptions: {
      external: ['nest-react-router'],
    },
  },
});

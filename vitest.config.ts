import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/** Logic-only tests run in the node environment (no DOM required). */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/config/**'],
    },
  },
});

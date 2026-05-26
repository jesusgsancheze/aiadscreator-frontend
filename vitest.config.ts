import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Test config lives here (not in vite.config.ts) so the production build
// (`tsc -b`, which only typechecks vite.config.ts) stays clean. Vitest loads
// this file in preference to vite.config.ts, and we merge the vite config so
// the React/Tailwind plugins still apply during tests.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.d.ts',
          'src/**/__tests__/**',
          'src/test/**',
          'src/main.tsx',
          'src/i18n/**',
          'src/types/**',
        ],
        // Floor — the pre-commit hook fails if any number drops below this.
        // Raise the floor as test coverage grows; never lower it.
        thresholds: {
          statements: 4,
          branches: 40,
          functions: 25,
          lines: 4,
        },
      },
    },
  }),
);

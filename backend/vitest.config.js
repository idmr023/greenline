import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: './coverage',
      include: ['src/**/*.js'],
      // Ratchet anti-erosión: el piso actual con solo unit tests (~7%).
      // Subir estos umbrales a medida que se agregan tests (meta: 70%+).
      thresholds: {
        statements: 7,
        branches: 6,
        functions: 11,
        lines: 7,
      },
    },
  },
});
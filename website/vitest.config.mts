import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, '.') },
  },
  test: {
    include: ['lib/**/__tests__/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['lib/blocks.ts', 'lib/i18n.ts', 'lib/search-query.ts', 'lib/search.ts', 'lib/well.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});

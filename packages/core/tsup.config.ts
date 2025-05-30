import { defineConfig } from 'tsup';
import type { BuildOptions } from 'esbuild';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'pipeline/index': 'src/pipeline/index.ts',
    'component/index': 'src/component/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  esbuildOptions(options: BuildOptions) {
    options.resolveExtensions = ['.ts', '.js'];
  },
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
  platform: 'node',
  target: 'es2020',
});

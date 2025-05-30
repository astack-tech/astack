// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defineConfig, Options } from 'tsup';
import type { BuildOptions } from 'esbuild';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'text/index': 'src/text/index.ts',
    'agents/index': 'src/agents/index.ts',
    'tool-invoker/index': 'src/tool-invoker/index.ts',
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
  outExtension({ format }: { format: string }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
  platform: 'node',
  target: 'es2020',
});

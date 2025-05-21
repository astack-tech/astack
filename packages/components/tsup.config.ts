import { defineConfig, Options } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'text/index': 'src/text/index.ts',
    'llm/index': 'src/llm/index.ts',
    'agents/index': 'src/agents/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  esbuildOptions(options: any) {
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

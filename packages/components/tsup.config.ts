import { defineConfig } from 'tsup';

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
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  platform: 'node',
  target: 'es2022',
});

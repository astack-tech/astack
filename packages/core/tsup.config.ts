import { defineConfig } from 'tsup';
import { execSync } from 'child_process';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'pipeline/index': 'src/pipeline/index.ts',
    'component/index': 'src/component/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  async onSuccess() {
    execSync('tsc -p tsconfig.json', {
      stdio: 'inherit',
    });
  },
  esbuildOptions(options) {
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

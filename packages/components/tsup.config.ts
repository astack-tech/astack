import { defineConfig, Options } from 'tsup';
import { execSync } from 'child_process';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'text/TextSplitter': 'src/text/TextSplitter.ts'
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

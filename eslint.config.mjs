// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Matches CJK ideographs, CJK punctuation, kana, Hangul and full-width forms.
 * Source code, comments and string literals must be written in English.
 */
const NON_ENGLISH_PATTERN =
  /[ᄀ-ᇿ⺀-⿟　-ヿ㄰-㆏㐀-䶿一-鿿가-힯豈-﫿︰-﹏＀-￯]/u;

/** @type {import('eslint').ESLint.Plugin} */
const astackPlugin = {
  meta: { name: 'astack' },
  rules: {
    'english-only': {
      meta: {
        type: 'suggestion',
        docs: { description: 'Require English-only source code, comments and strings.' },
        schema: [],
        messages: { nonEnglish: 'Use English only in code, comments and strings.' },
      },
      create(context) {
        return {
          Program() {
            const { lines } = context.sourceCode;
            lines.forEach((text, index) => {
              const match = NON_ENGLISH_PATTERN.exec(text);
              if (match) {
                context.report({
                  loc: {
                    start: { line: index + 1, column: match.index },
                    end: { line: index + 1, column: match.index + 1 },
                  },
                  messageId: 'nonEnglish',
                });
              }
            });
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.next-dev/**',
      '**/.turbo/**',
      '**/next-env.d.ts',
      '.pnpm-store/**',
      'website/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { astack: astackPlugin },
    rules: {
      'astack/english-only': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    files: ['packages/*/src/**/*.ts'],
    ignores: ['**/*.test.ts', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  {
    // Examples and scripts are command-line programs: console output is their interface.
    files: ['examples/**/*.{ts,tsx}', 'scripts/**/*.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['examples/serve-astack/frontend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier
);

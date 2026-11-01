// @ts-check
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const baseDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

/**
 * Matches CJK ideographs, CJK punctuation, kana, Hangul and full-width forms.
 * Source code, comments and string literals must be written in English.
 */
const NON_ENGLISH_PATTERN =
  /[\u1100-\u11ff\u2e80-\u2fdf\u3000-\u30ff\u3130-\u318f\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef]/u;

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
            context.sourceCode.lines.forEach((text, index) => {
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
    ignores: ['.next/**', '.next-dev/**', 'node_modules/**', 'out/**', 'next-env.d.ts'],
  },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: baseDirectory,
      },
    },
    plugins: { astack: astackPlugin },
    rules: {
      'astack/english-only': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  }
);

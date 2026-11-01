// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Matches CJK ideographs, CJK punctuation, kana, Hangul and full-width forms.
 * Source code, comments and string literals must be written in English.
 */
const NON_ENGLISH_PATTERN =
  /[\u1100-\u11ff\u2e80-\u2fdf\u3000-\u30ff\u3130-\u318f\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef]/u;

/** @type {import('eslint').Rule.RuleModule} */
const englishOnlyRule = {
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
};

/**
 * Matches the start of a JSDoc `@type` block comment. Followed by a parenthesized
 * expression, such a comment is a type cast: the JavaScript form of `value as Foo`.
 */
const JSDOC_TYPE_PATTERN = /^\*\s*@type\s*\{/u;

/** @type {import('eslint').Rule.RuleModule} */
const noJsdocCastRule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow JSDoc type casts, the JavaScript form of `as`.' },
    schema: [],
    messages: {
      jsdocCast:
        'Do not cast with a JSDoc @type comment. Narrow the value with a type guard instead.',
    },
  },
  create(context) {
    const { sourceCode } = context;
    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type !== 'Block' || !JSDOC_TYPE_PATTERN.test(comment.value)) {
            continue;
          }
          const next = sourceCode.getTokenAfter(comment, { includeComments: false });
          if (next?.value === '(') {
            context.report({ loc: comment.loc ?? next.loc, messageId: 'jsdocCast' });
          }
        }
      },
    };
  },
};

/**
 * Bans every type assertion, `as const` included: types come from annotations, inference
 * and type guards, never from a claim the compiler cannot check.
 * @type {import('eslint').Linter.RuleEntry}
 */
const NO_TYPE_ASSERTIONS = [
  'error',
  {
    selector: 'TSAsExpression',
    message:
      'Type assertions are not allowed, `as const` included. Annotate the type, use a const type parameter, or narrow with a type guard.',
  },
  {
    selector: 'TSTypeAssertion',
    message: 'Type assertions are not allowed. Annotate the type or narrow with a type guard.',
  },
];

/** @type {import('eslint').ESLint.Plugin} */
const astackPlugin = {
  meta: { name: 'astack' },
  rules: { 'english-only': englishOnlyRule, 'no-jsdoc-cast': noJsdocCastRule },
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/temp/**',
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
      'astack/no-jsdoc-cast': 'error',
      'no-restricted-syntax': NO_TYPE_ASSERTIONS,
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
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
    plugins: { tsdoc },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Doc comments in packages follow TSDoc; TypeDoc and API Extractor read them.
      'tsdoc/syntax': 'error',
    },
  },
  {
    // Examples and scripts are command-line programs: console output is their interface.
    files: ['examples/**/*.ts', 'scripts/**/*.{js,mjs,ts}', 'assets/brand/*.cjs'],
    rules: {
      'no-console': 'off',
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

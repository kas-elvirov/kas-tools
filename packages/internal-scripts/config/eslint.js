// packages/internal-scripts/config/eslint.js
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'

import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Override for .test.js files and CJS-tests
  {
    files: ['**/__tests__/**/*.js', '**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        require: 'readonly',
      },
    },
  },

  prettier
]

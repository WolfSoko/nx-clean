import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...nx.configs['flat/base'],
  {
    plugins: {
      prettier: eslintPluginPrettier,
      sonarjs: eslintPluginSonarjs,
      'unused-imports': eslintPluginUnusedImports,
      '@typescript-eslint': typescriptEslintEslintPlugin,
      import: eslintPluginImport,
    },
  },
  { languageOptions: { globals: { ...globals.node, ...globals.browser, ...globals.es2022 } } },
  ...compat
    .config({
      // eslint-plugin-sonarjs v4 ships a flat-native `recommended` (with a top-level
      // `name`, which FlatCompat's eslintrc-schema validator rejects); use the
      // eslintrc-shaped `recommended-legacy` export instead.
      extends: ['eslint:recommended', 'plugin:sonarjs/recommended-legacy'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: '*',
                onlyDependOnLibsWithTags: ['*'],
              },
            ],
          },
        ],
      },
    })),
  ...nx.configs['flat/typescript'],
  ...compat
    .config({
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
          typescript: {},
        },
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        ...config.rules,
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
          'warn',
          {
            accessibility: 'no-public',
          },
        ],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-empty-object-type': ['off'],
        '@typescript-eslint/no-unsafe-function-type': ['off'],
        '@typescript-eslint/no-wrapper-object-types': ['off'],
        '@typescript-eslint/no-deprecated': 'error',
        'import/order': [
          'error',
          {
            pathGroups: [
              {
                pattern: '@nx-*/**',
                group: 'internal',
                position: 'before',
              },
            ],
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
            pathGroupsExcludedImportTypes: [],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'import/no-unresolved': ['off'],
      },
    })),
  {
    // Root-level config files (e.g. jest.config.ts) aren't part of any
    // project's tsconfig, so they have no type information for
    // @typescript-eslint/no-deprecated (a type-aware rule) to use.
    // no-require-imports is also off here: the @nx/jest CJS-conversion
    // migration generates a `require('@nx/jest')` for the async
    // getJestProjectsAsync() export, which this rule (newly enabled by
    // typescript-eslint v8's recommended set) would otherwise flag.
    files: ['jest.config.ts'],
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  ...nx.configs['flat/javascript'],
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:prettier/recommended'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.json', '**/*.md', '**/*.html'],
      rules: {
        ...config.rules,
      },
    })),
];

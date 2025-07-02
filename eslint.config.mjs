// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      '**/*.mjs',
      'eslint.config.mjs',
      '**/*.js',
      'node_modules',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // Prettier
      'prettier/prettier': ['error', {
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        semi: false,
        endOfLine: 'auto',
      }],

      // JSX A11Y
      'jsx-a11y/alt-text': ['warn', {
        elements: ['img'],
        img: ['Image'],
      }],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      // Custom
      'no-useless-constructor': 'off',
      'no-new': 'off',

      // Typescript custom rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
)

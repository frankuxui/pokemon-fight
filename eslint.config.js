import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { files: [ '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}' ], plugins: { js }, extends: [ 'js/recommended' ], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Estas son las reglas de ESLint que uso en mis proyectos

  {
    rules: {

      // General

      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'all',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_' ,
          varsIgnorePattern: '^_',
          ignoreClassWithStaticInitBlock: true
        }
      ],

      // Typescript

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'all',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_' ,
          varsIgnorePattern: '^_'
        }
      ],
      'no-undef': [ 'warn', { 'typeof': true } ],
      'linebreak-style': [ 'warn', 'windows' ],

      '@typescript-eslint/no-explicit-any': 'off',

      // Semicolons

      semi: [ 'warn', 'never' ],

      // Quotes

      quotes: [ 'warn', 'single' ],

      // Indentation

      indent: [ 'error', 2 ],
      'indent-legacy': [ 'warn', 2 ],

      // Spacing

      'space-before-function-paren': [ 'warn', 'always' ],
      'space-before-blocks': [ 'warn', 'always' ],
      'space-in-parens': [ 'warn', 'never' ],
      'keyword-spacing': [ 'warn', { before: true, after: true } ],
      'object-curly-spacing': [ 'warn', 'always' ],
      'array-bracket-spacing': [ 'warn', 'always' ],
      'template-tag-spacing': [ 'warn', 'never' ],
      'no-mixed-spaces-and-tabs': [ 'warn', 'smart-tabs' ],
      'no-multiple-empty-lines': [ 'warn', { max: 1, maxEOF: 0 } ],
      'block-spacing': 'warn',
      'key-spacing': [ 'warn', { beforeColon: false, afterColon: true } ],
      'no-trailing-spaces': [ 'error', { 'skipBlankLines': false, 'ignoreComments': false } ],
      'no-multi-spaces': 'warn',

      // React

      'react/react-in-jsx-scope': 'off',

    }
  }
])

module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'semi': ['warn', 'never'],
    'no-plusplus': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'arrow-body-style': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'function-paren-newline': 'off',
    'eol-last': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'error', {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': 'I[A-Z]',
          'match': true
        }
      }
    ],
    'prefer-const': 'warn',
    'max-len': ['warn', { 'code': 125 }],
    'dot-notation': 'warn',
    'no-continue': 'warn',
    'no-dupe-else-if': 'error',
    'block-spacing': ['error', 'never'],
    'no-spaced-func': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': ['error', {
      'ignoreComments': false,
    }],
    'quotes': ['warn', 'single'],
    'no-return-await': ['error'],
  },
} 

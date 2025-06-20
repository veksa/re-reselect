module.exports = {
  'env': {
    'browser': true,
    'node': true,
  },
  'extends': 'eslint:recommended',
  'ignores': [
    'dist',
    'node_modules',
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 2015,
  },
  'rules': {
    'array-bracket-spacing': [0],
    'comma-dangle': [2, 'always-multiline'],
    'eol-last': 2,
    'no-multiple-empty-lines': 2,
    'object-curly-spacing': [2, 'never'],
    'quotes': [
      2,
      'single',
      {'avoidEscape': true, 'allowTemplateLiterals': true},
    ],
    'semi': [2, 'always'],
    'strict': 0,
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [0],
  },
  'overrides': [
    {
      'parser': '@typescript-eslint/parser',
      'files': ['*.{c,m,}{t,j}s', '*.{t,j}sx'],
      'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module',
        'project': true,
      },
      'env': {'jest': true},
      'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      'rules': {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/no-use-before-define': ['off'],
        '@typescript-eslint/ban-types': 'off',
        'prefer-rest-params': 'off',
        'prefer-spread': 'off',
        '@typescript-eslint/consistent-type-imports': [
          2,
          {'fixStyle': 'separate-type-imports'},
        ],
        '@typescript-eslint/consistent-type-exports': [2],
      },
    },
    {
      'files': ['**/test/**/*.ts'],
      'rules': {
        'consistent-return': 'off',
        'max-lines': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
    },
    {
      'parser': '@typescript-eslint/parser',
      'files': ['./docs/examples/**/*.{js,ts,jsx,tsx}'],
      'parserOptions': {
        'ecmaVersion': 2023,
        'sourceType': 'module',
        'ecmaFeatures': {'jsx': true},
      },
      'rules': {
        'no-unused-vars': [0],
      },
    },
  ],
};

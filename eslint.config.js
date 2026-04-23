import globals from 'globals';

export default [
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'examples/**/*.js', 'dashboard-server.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];

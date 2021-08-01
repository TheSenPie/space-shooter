module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-tabs': ['error', { allowIndentationTabs: true }],
  },
};

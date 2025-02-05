// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@rushstack/typedef-var': 'off',
  },
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated*/**', 'vitest.*.ts'],
};

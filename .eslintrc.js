const { overrides } = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: '@1stg',
  overrides: [
    ...overrides,
    {
      files: '*.ts',
      rules: {
        '@typescript-eslint/member-naming': 0,
        '@typescript-eslint/no-type-alias': 0,
        'import/order': 0,
      },
    },
    {
      files: ['*.module.ts', 'module.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 0,
      },
    },
  ],
}

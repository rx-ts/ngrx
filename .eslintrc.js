const {overrides} = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: '@1stg',
  overrides:[
     ...overrides,
    {
      files:'*.ts',
      rules:{
        '@typescript-eslint/member-naming':0,
        "import/named":0
      }
    },
    {
      files:'*.module.ts',
      rules:{
        '@typescript-eslint/no-extraneous-class':0
      }
    }
  ]
}

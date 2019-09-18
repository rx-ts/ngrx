module.exports = {
  extends: '@1stg/eslint-config/recommended',
  settings: {
    node: {
      allowModules: ['@rxts/ngrx', 'lodash'],
    },
  },
}

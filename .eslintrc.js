module.exports = {
  extends: '@1stg/eslint-config/loose',
  settings: {
    node: {
      allowModules: ['@rxts/ngrx', 'lodash'],
    },
  },
}

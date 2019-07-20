import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'
import webpackMerge from 'webpack-merge'

export default ({ config }: { config: Configuration }) =>
  webpackMerge(config, {
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.stories\.tsx?$/,
          loader: '@storybook/addon-storysource/loader',
          options: {
            parser: 'typescript',
          },
          enforce: 'pre',
        },
      ],
    },
  })

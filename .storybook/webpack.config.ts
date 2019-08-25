import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'
import webpackMerge from 'webpack-merge'

const globalStyle = path.resolve(__dirname, 'global.scss')

export default ({
  config,
  mode,
}: {
  config: Configuration
  mode: Configuration['mode']
}) => {
  const sourceMap = mode === 'development'
  ;(config.module!.rules[0].exclude as string[]).push(globalStyle)
  config = webpackMerge(config, {
    entry: [globalStyle],
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            ...['css', 'sass'].map(prefix => ({
              loader: prefix + '-loader',
              options: {
                sourceMap,
              },
            })),
          ],
          include: globalStyle,
        },
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
  return config
}

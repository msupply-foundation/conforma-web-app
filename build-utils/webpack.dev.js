const commonPaths = require('./common-paths')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const port = process.env.PORT || 3000

const config = {
  mode: 'development',
  output: {
    filename: '[name].[hash].js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
}
module.exports = config

const commonPaths = require('./common-paths')
const webpack = require('webpack')
const port = process.env.PORT || 3000

const config = {
  mode: 'development',
  entry: {
    app: `${commonPaths.appEntry}/index.tsx`
  },
  output: {
    filename: '[name].[hash].js'
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
            },
          },
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true
  }
};
module.exports = config
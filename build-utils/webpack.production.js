const commonPaths = require('./common-paths')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  mode: 'production',
  output: {
    filename: 'static/[name].[hash].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
          use: [
            {
              // We configure 'MiniCssExtractPlugin'              
              loader: MiniCssExtractPlugin.loader,
            },            
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            'postcss-loader',
            'less-loader'
          ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:4].css'
    })
  ]
};
module.exports = config
const webpack = require('webpack'); //to access built-in plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      {
          test: /\.css$/, use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/*.html", to: "[name].[ext]" },
      ],
    }),
    new VueLoaderPlugin()
  ]
};
const { Module } = require("webpack");
const path = require('path');

module.exports = {
  entry: "./main.js",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement"
                }
              ]
            ]
          }
        }
      }
    ]
  },
  mode: "development"
}
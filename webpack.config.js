const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const env = process.env.NODE_ENV


const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = (env, options) => {
  console.log("WEBPACK ENV", options.mode);
  return {
    devtool: 'source-map',
    output: {
        publicPath: options.mode === 'prodcition' ? './' : '',
        path: path.resolve('docs'),
        filename: 'bundled.js'
    },
    module: {
      rules: [
        { test: /\.json$/, 
          loaders: ['json-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(css|scss)$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [htmlWebpackPlugin]
  }
};
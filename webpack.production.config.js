var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry : [
    "babel-core/polyfill",
    "./react/main.jsx"
  ],
  output : {
    path : path.resolve('./public/javascripts'),
    filename : "bundle.js"
  },
  module : {
    loaders : [
      {
        test : /\.js/,
        loader : 'babel-loader',
        exclude : /node_modules/
      }
    ]
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool : 'source-map'
};
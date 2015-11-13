var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry : [
    "webpack-dev-server/client?http://localhost:8000",
    "webpack/hot/only-dev-server",
    "babel-core/polyfill",
    "./react/main.jsx"
  ],
  output : {
    path : path.resolve('./public/javascripts'),
    filename : "bundle.js",
    publicPath : 'http://localhost:8000/javascripts'
  },
  module : {
    loaders : [
      {
        test : /\.js/,
        loaders : ['react-hot', 'babel-loader'],
        exclude : /node_modules/
      }
    ]
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool : 'source-map'
};
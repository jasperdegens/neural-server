var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config");

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  publicPath : config.output.publicPath,
  hot : true
});

server.listen(8000, 'localhost', function(err, res){
  if (err) { console.log(err);}

  console.log('listening on port 8000');
});
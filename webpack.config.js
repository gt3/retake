var webpack = require('webpack');
var path = require('path');
var uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: false, drop_console: true}});
module.exports = {
    devtool: "source-map",
    entry: path.join(__dirname,'src/index.js'),
    output: {
        path: path.join(__dirname,'lib/'),
        filename: 'retake.min.js',
        library: 'retake',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
      loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
      ]
    },
    plugins: [uglify]
};
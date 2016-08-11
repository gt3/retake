var webpack = require('webpack');
var path = require('path');
const minify = process.argv.indexOf('--env.compress') !== -1;
var uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: true, drop_console: true, dead_code: false, conditionals: false}});
var plugins = [], filename = 'retake.js';
if(minify) {
    plugins.push(uglify);
    filename = 'retake.min.js';
}
module.exports = {
    devtool: "source-map",
    entry: './src/index.js',
    output: {
        path: './lib/',
        filename: filename,
        library: 'retake',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
      loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
      ]
    },
    plugins: plugins
};
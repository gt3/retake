var webpack = require('webpack');
var path = require('path');
const babelify = process.argv.indexOf('--env.transpile-compress') !== -1;
var uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: true, drop_console: true, dead_code: false, conditionals: false}});
var plugins = [], loaders = [], filename = 'retake.js';
if(babelify) {
    plugins.push(uglify);
    filename = 'retake.es5.min.js';
    loaders.push({ test: /\.js$/, exclude: /node_modules/, loader: 'babel' })
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
      loaders: loaders
    },
    plugins: plugins
};
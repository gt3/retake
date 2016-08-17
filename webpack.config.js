var webpack = require('webpack');
var path = require('path');
const minify = process.argv.indexOf('--env.compress') !== -1;
var uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: true, drop_console: true, dead_code: false, conditionals: false}});
var entry = './src/index.js', plugins = [], filename = 'retake.js', libraryTarget = 'umd';
if(minify) {
    entry = './lib/retake.es5.js';
    plugins.push(uglify);
    filename = 'retake.es5.min.js';
}
var output = { path: './lib/', filename: filename, library: 'retake', libraryTarget: libraryTarget, umdNamedDefine: true }

module.exports = {
    devtool: "source-map",
    entry: entry,
    output: output,
    plugins: plugins
};
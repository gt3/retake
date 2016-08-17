var webpack = require('webpack');
var path = require('path');
const minify = process.argv.indexOf('--env.compress') !== -1;
var uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: true, drop_console: true, dead_code: false, conditionals: false}});
var entry = './src/index.js', plugins = [], filename = 'retake.js'
if(minify) {
    entry = './lib/retake.es5.js';
    plugins.push(uglify);
    filename = 'retake.es5.min.js';
}
module.exports = {
    devtool: "source-map",
    entry: entry,
    output: {
        path: './lib/',
        filename: filename,
        library: 'retake',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugins
};
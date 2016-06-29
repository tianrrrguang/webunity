const $gulp = require('gulp');
const $cheerio = require('cheerio');
const $glob = require('glob');
const $gutil = require('gulp-util');
const $plumber = require('gulp-plumber');
const $c = require('../public/const.js');
const $public = require('../public/public.js');
const $fs = require('fs-extra');
const $path = require('path');
const $webpack = require("webpack");
const $chalk = require('chalk');
const $async = require('async');
const config = require('../config.js');
const $data = require('../public/data.js');
//webpack
const ExtractTextPlugin = require("extract-text-webpack-plugin");


//入口文件编译
$gulp.task('jspack', function (callback) {

    const ret = $data.get('webpack');
   
    $webpack({
        resolve: {
            root: [
                $c.app_script_path,
                $c.app_style_path,
                $c.vendor_path
            ]
        },
        entry: ret.entries,
        output: {
            path: $c.dist_path,
            filename: config.webpack_jsformat
        },
        profile: false,
        module: {
            loaders: [
                //es6
                {
                    test: /\.js?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015'],
                        cacheDirectory: true
                    }
                },
                //css
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(config.webpack_cssformat),
            
            new $webpack.optimize.CommonsChunkPlugin({
                name: '__lib',
                filename: config.webpack_jsformat,
                minChunks: ret.chunkNumLimit
            }),
            function () {
                this.plugin("done", function (stats) {
                    const assetsByChunkName = stats.toJson().assetsByChunkName;
                    // console.log(assetsByChunkName);
                    $async.map(ret.dataList, function (data, cb) {
                        const $ = $cheerio.load($fs.readFileSync(data.file).toString());
                        const jsList = data.jsList;
                        jsList.unshift('__lib');
                        jsList.forEach(function (js) {
                            var jshashList = assetsByChunkName[js];
                            if (typeof jshashList == 'string') {
                                jshashList = [jshashList];
                            }
                            jshashList.forEach(function (rfile) {
                                const ext = $path.extname(rfile);
                                if (ext == '.js') {
                                    $('body').append('\r\n<script src="' + rfile + '"></script>');
                                }
                                else if (ext == '.css') {
                                    $('head').append('\r\n<link rel=stylesheet href="' + rfile + '">');
                                }
                            });
                        });
                        $('body').append('\r\n');
                        $('head').append('\r\n');
                        $fs.outputFile(data.file, $.html());
                    });
                });
            }
        ]
    }, function (err, stats) {
        if (err) throw new $gutil.PluginError("webpack", err);
        var msg = stats.toString({});
        var TimeIndex = msg.indexOf('Time');
        var ChunkIndex = msg.indexOf('{0}');
        msg = msg.slice(TimeIndex, ChunkIndex-9);
        $gutil.log($chalk.green("jspack success!\n"), $chalk.dim(msg));
        callback();
    });

});
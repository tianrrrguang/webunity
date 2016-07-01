const $gulp = require('gulp');
const $cheerio = require('cheerio');
const $glob = require('glob');
const $gutil = require('gulp-util');
const $plumber = require('gulp-plumber');
const $fs = require('fs-extra');
const $path = require('path');
const $webpack = require("webpack");
const $chalk = require('chalk');
const $async = require('async');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const $c = require('../public/const.js');
const $public = require('../public/public.js');
const config = require('../config.js');
const $data = require('../public/data.js');

//入口文件编译
$gulp.task('webpack', function (callback) {

    const ret = $data.get('webpack');

    $webpack({
        resolve: {
            root: [
                $c.app_script_path,
                $c.app_style_path,
                $c.webunity_path
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
                    loader: ExtractTextPlugin.extract("css")
                },
                //stylus
                {
                    test: /\.styl$/,
                    loader: ExtractTextPlugin.extract('style', 'css!stylus')
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
                    const files = $data.get('webunity-file-list');
                    $async.map(files, function (d, cb) {
                        const file = d.file;
                        const $ = d.$;
                        const basename = $path.basename(file, '.html');
                        ['__lib', basename].forEach(function (js) {
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
                        if( config.webunity_removeNode ){
                            $('*').removeAttr($c.unodeAttrName);
                        }
                        $fs.outputFile(file, $.html());
                    });
                });
            }
        ]
    }, function (err, stats) {
        if (err) throw new $gutil.PluginError("webpack", err);
        var msg = stats.toString({});
        var TimeIndex = msg.indexOf('Time');
        var ChunkIndex = msg.indexOf('{0}');
        msg = msg.slice(TimeIndex, ChunkIndex - 9);
        $gutil.log($chalk.green("webpack success!\n"), $chalk.dim(msg));
        callback();
    });

});
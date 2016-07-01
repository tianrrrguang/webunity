const $gulp = require('gulp');
const $ejs = require("gulp-ejs");
const $gutil = require('gulp-util');
const $plumber = require('gulp-plumber');
const $clearDir = require('clear-dir');
const $chalk = require('chalk');
const $rename = require("gulp-rename");

const $c = require('../public/const.js');
const config = require('../config.js');

//入口文件编译，输出已经整理了ejs的html文件
$gulp.task('entry', function () {
    if (config.dist_auto_clear) {
        $gutil.log($chalk.yellow(`清空输出目录: `), $c.dist_path);
        $clearDir($c.dist_path, function () { }, function () { });
        $clearDir($c.webpack_tempjs, function () { }, function () { });
    }

    const path = $c.app_template_path;
    const suffix = config.dist_version_rename ? ('.' + config.dist_version) : '';

    return $gulp.src(`${path}/*${config.src_template_ext}`)
        .pipe($plumber())
        .pipe($ejs({
            delimiter: config.ejs_delimiter
        }, {}))
        .pipe($rename({
            suffix: suffix
        }))
        .pipe($gulp.dest($c.dist_path));
});
const $gulp = require('gulp');
const $gutil = require('gulp-util');
const $c = require('../public/const.js');
const $glob = require('glob');
const config = require('../config.js');
const $path = require('path');
const $chalk = require('chalk');
const $data = require('../public/data.js');

//入口文件编译，输出已经整理了ejs的html文件
$gulp.task('jscache', function (callback) {
    
    const files = $glob.sync($c.app_script_path + "/**/*.js", {});
    const cache = {};
    files.forEach(function(file){
        const basename = $path.basename(file, '.js').toLowerCase();
        if( cache[basename] ){
            $gutil.log($chalk.red(`[发现一个可能引起异常的错误]>>>`));
            $gutil.log($chalk.red(`重复的用户脚本组件名称: ${basename}`));
            $gutil.log($chalk.red(`物理位置:${file}`));
            $gutil.log($chalk.red(`冲突脚本:${cache[basename]}`));
            return;
        }
        cache[basename] = file;
    });

    //数据存储
    $data.set('jscache', cache);

    //结束任务
    callback(null);

});
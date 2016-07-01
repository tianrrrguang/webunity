const $gulp = require('gulp');
const $cheerio = require('cheerio');
const $glob = require('glob');
const $gutil = require('gulp-util');
const $fs = require('fs-extra');
const $path = require('path');
const $chalk = require('chalk');
const $jsonFormat = require('json-format');

const $c = require('../public/const.js');
const $data = require('../public/data.js');
const $public = require('../public/public.js');
const config = require('../config.js');

//入口文件编译
$gulp.task('webunity-script', function (callback) {

    const files = $data.get('webunity-file-list');
    const jscache = getJsCache();

    files.forEach(function (d, index) {
        const file = d.file;
        const $ = d.$;
        const nodeCache = files[index].nodeCache;
        //提取基本名字
        const basename = $path.basename(file, '.html');
        //所有的脚本的缓存
        const modCache = [];
        //分析脚本
        $('*[unode]').each(function () {
            const elem = $(this);
            //unode节点名称
            const uNodeName = elem.attr($c.unodeAttrName);
            const jsList = getUScript(elem, $, jscache);
            nodeCache[uNodeName].script = jsList;
            //临时js文件，script部分
            const temojsTxtScript = [];
            jsList.forEach(function(d){
                if( config.webunity_removeScript ){
                    elem.removeAttr(d.attrname);
                }
            });
        });

        //用来测试当前的html状态
        // $fs.outputFileSync(file, $.html());

    });

    //数据存储
    $data.set('webunity-file-list', files);

    //结束任务
    callback(null);

});

//获取脚本
function getUScript(elem, $, jscache) {
    
    const ret = [];
    const attrs = elem.attr();
    const key = 'uscript.';

    for (var v in attrs) {
        if (v.indexOf(key) != 0) {
            continue;
        }
        var jsname = v.replace(key, '');
        var jsfile = jscache[jsname];
        if (!jsfile || !$fs.existsSync(jsfile)) {
            $gutil.log($chalk.red(`[Error]${jsname}，无效的脚本引用`));
            continue;
        }
        // $gutil.log($chalk.green(`[OK]${jsname}`));
        var refStr = attrs[v];
        var jsref = {};

        if (refStr.length >= 3) {
            refArr = refStr.split(',');
            for (var i = 0; i < refArr.length; i++) {
                var r = refArr[i];
                if (r.indexOf('=') < 0) {
                    continue;
                }
                var rArr = r.split('=');
                jsref[rArr[0]] = rArr[1];
            }
        }
        ret.push({
            name: jsname,
            file: jsfile.replace($c.app_script_path + '/', ''),
            ref: jsref,
            attrname: v
        });
    }
    return ret;
};

//获取js缓存
function getJsCache(){

    const cache = {};
    const files = $glob.sync(`${$c.app_script_path}/**/*.js`, {});
    $gutil.log($chalk.yellow(`检查js文件数量: `), files.length);
    
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

    return cache;
}
const $gulp = require('gulp');
const $cheerio = require('cheerio');
const $glob = require('glob');
const $gutil = require('gulp-util');
const $c = require('../public/const.js');
const $data = require('../public/data.js');
const $public = require('../public/public.js');
const $fs = require('fs-extra');
const $path = require('path');
const $chalk = require('chalk');
const config = require('../config.js');
const temptpl = require('../tpl/tempjs.js');
const $wuParse = require('../webunity/parse.js');

//入口文件编译
$gulp.task('webunity-script', function (callback) {

    const files = $glob.sync($c.dist_path + "/*" + config.src_template_ext, {});
    const ret = {
        chunkNum: files.length,
        chunkRatio: 0.3,
        chunkNumLimit: 2,
        dataList: [],
        entries: {}
    };

    files.forEach(function (file) {
        //提取基本名字
        const basename = $path.basename(file, '.html');
        //获取cheerio对象
        const $ = $cheerio.load($fs.readFileSync(file).toString());
        //找出所有的webunity节点
        const uNodeList = $('*[unode]');
        //开始构建临时js文件
        var tempjsTxt = temptpl.b1();
        //附加所有WebUnityNode的id属性
        uNodeList.each(function (index) {
            //提取/增加id值
            const id = $(this).attr('id') || $wuParse.idprefix + index;
            $(this).attr('id', id);
        });
        //分析脚本
        uNodeList.each(function (index) {
            const uNodeName = $(this).attr('unode') || $wuParse.nodeprefix + index;
            const uNodeId = $(this).attr('id');
            //提取脚本
            const jsList = $wuParse.getUScript($(this), $);
            if (!jsList.length) {
                jsList.push({ script: false });
            }
            jsList.forEach(function (_data) {
                tempjsTxt += temptpl.b2(uNodeName, uNodeId, _data);
            });
        });
        //输出html文件
        // $('*').removeAttr('webunitynode');
        // $('*').removeAttr('webunityscript');
        $fs.outputFileSync(file, $.html());
        //输出临时js文件
        tempjsTxt += temptpl.b3();
        const tempjs = $path.resolve($c.webpack_tempjs, basename + '.js');
        $fs.outputFileSync(tempjs, tempjsTxt);
        //数据
        ret.entries[basename] = tempjs;
        ret.dataList.push({ file: file, jsList: [basename] });
    });

    //计算合并的数量
    ret.chunkNumLimit = Math.max(ret.chunkNumLimit, Math.round(ret.chunkNum * ret.chunkRatio));
    $gutil.log($chalk.yellow("WebUnityNode总计:"), ret.chunkNum, ", ", $chalk.yellow("优化基数:"), ret.chunkNumLimit);

    //数据存储
    $data.set('webpack', ret);

    //结束任务
    callback(null);

});
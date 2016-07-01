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
$gulp.task('webunity-style', function (callback) {

    const files = $data.get('webunity-file-list');

    files.forEach(function (d, index) {
        const file = d.file;
        const $ = d.$;
        const nodeCache = files[index].nodeCache;
        //提取基本名字
        const basename = $path.basename(file, '.html');
        //分析样式
        $('*[unode]').each(function () {
            const elem = $(this);
            //id
            const id = elem.attr('id');
            //unode节点名称
            const uNodeName = elem.attr($c.unodeAttrName);
            //样式名称
            const styleList = elem.attr('ustyle');
            const styleArr = styleList ? styleList.split(',') : [];
            nodeCache[uNodeName].style = styleArr;
            //移除数据
            elem.removeAttr('ustyle');
        });

        //用来测试当前的html状态
        // $fs.outputFileSync(file, $.html());

    });


    //数据存储
    $data.set('webunity-file-list', files);

    //结束任务
    callback(null);

});
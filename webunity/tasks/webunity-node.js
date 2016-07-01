const $gulp = require('gulp');
const $cheerio = require('cheerio');
const $glob = require('glob');
const $gutil = require('gulp-util');
const $fs = require('fs-extra');
const $path = require('path');
const $chalk = require('chalk');

const $c = require('../public/const.js');
const $data = require('../public/data.js');
const $public = require('../public/public.js');
const config = require('../config.js');

//入口文件编译
$gulp.task('webunity-node', function (callback) {

    const files = [];
    const filesList = $glob.sync(`${$c.dist_path}/*${config.src_template_ext}`, {});

    filesList.forEach(function (file) {
        const nodeCache = {};
        //获取cheerio对象
        const $ = $cheerio.load($fs.readFileSync(file).toString());
        //找出所有的webunity节点
        const uNodeList = $(`*[${$c.unodeAttrName}]`);
        //附加所有WebUnityNode的id属性
        uNodeList.each(function (index) {
            //设置id值
            const id = $(this).attr('id') || `_unode_id_${index}`;
            $(this).attr('id', id);
            //设置默认的uNode名字
            const uNodeName = $(this).attr($c.unodeAttrName) || `_node_${index}`;
            $(this).attr($c.unodeAttrName, uNodeName);
            //缓存
            nodeCache[uNodeName] = {
                domid: id,
                nodename: uNodeName
            };
        });
        
        //记录数据
        files.push({
            file: file,
            $: $,
            nodeCache: nodeCache
        });

        //用来测试当前的html状态
        // $fs.outputFileSync(file, $.html());
    });

    //数据存储
    $data.set('webunity-file-list', files);

    //结束任务
    callback(null);

});
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
$gulp.task('webunity-tempjs', function (callback) {

    const files = $data.get('webunity-file-list');
    const webpack = {
        entries: {},
        chunkNumLimit: 2,//最底是2
    };

    files.forEach(function(d, index){
        const file = d.file;
        const nodeCache = d.nodeCache;
        const basename = $path.basename(file, '.html');
        var tempjsTxt = `//程序自动生成，切勿手动修改\r\nimport WebUnityUtils from 'webunity-utils.js';\r\n\r\nconst nodeCache = {};\r\n`;
        
        for(var name in nodeCache){
            //整理脚本
            var temojsTxtScript = [];
            nodeCache[name].script.forEach(function(dj){
                temojsTxtScript.push(`{name: '${dj.name}', mod: require('${dj.file}').default, ref: ${JSON.stringify(dj.ref)}}`);
            });   
            //整理样式
            var temojsTxtStyle = [];
            nodeCache[name].style.forEach(function(dc){
                dc = dc.replace(/(^\s*)|(\s*$)/g, "");
                temojsTxtStyle.push(`require('${dc}')`);
            });
            //整理node
            var properties = [];
            properties.push(`nodename: '${nodeCache[name].nodename}'`);
            properties.push(`domid: '${nodeCache[name].domid}'`);
            temojsTxtScript.length && properties.push(`script: [${temojsTxtScript.join(',')}]`);
            temojsTxtStyle.length && properties.push(`style: [${temojsTxtStyle.join(',')}]`);
            //统一输出
            tempjsTxt += `nodeCache['${name}'] = {\r\n    ${properties.join(',\r\n    ')}\r\n};\r\n`;
        }
        tempjsTxt += `\r\nWebUnityUtils.init(nodeCache);`;

        //输出临时js文件
        const tempjsPath = $path.resolve($c.webpack_tempjs, basename + '.js');
        $fs.outputFileSync(tempjsPath, tempjsTxt);

        webpack.entries[basename] = tempjsPath;
    });

    //计算合并的数量
    webpack.chunkNumLimit = Math.max(webpack.chunkNumLimit, Math.round(files.length * config.webpack_optimize));
    $gutil.log($chalk.yellow("入口总计:"), files.length, ", ", $chalk.yellow("优化基数:"), webpack.chunkNumLimit);

    //数据存储
    $data.set('webpack', webpack);

    //结束任务
    callback(null);

});
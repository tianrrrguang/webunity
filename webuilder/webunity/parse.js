const $c = require('../public/const.js');
const $fs = require('fs-extra');
const $path = require('path');
const $gutil = require('gulp-util');
const $chalk = require('chalk');
const $wuParse = require('../webunity/parse.js');
const $data = require('../public/data.js');

exports.idprefix = '_unode_id_';
exports.nodeprefix = '_node_';

exports.getUScript = function (elem, $) {
    const jscache = $data.get('jscache');
    const ret = [];
    const attrs = elem.attr();
    const key = 'uscript.';
    for (var v in attrs) {
        if (v.indexOf(key) != 0) {
            continue;
        }
        var jsname = v.replace(key, '');
        var jsfile = jscache[jsname];
        if ( !jsfile || !$fs.existsSync(jsfile)) {
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
            script: jsname,
            js: jsfile.replace($c.app_script_path+'/', ''),
            ref: jsref
        });
    }
    return ret;
};
const $path = require('path');
const config = require('../config.js');

var ret = {};

//builder相关路径
ret.builder_path = $path.resolve(__dirname, '..');

//app
ret.app_path = $path.resolve(ret.builder_path, config.src);
ret.app_template_path = $path.resolve(ret.app_path, config.src_template);
ret.app_script_path = $path.resolve(ret.app_path, config.src_scripts);
ret.app_style_path = $path.resolve(ret.app_path, config.src_style);

//输出目录
ret.dist_path = $path.resolve(ret.builder_path, config.dist);

//webpack
ret.webpack_tempjs = $path.resolve(ret.builder_path, config.webpack_tempjs);

//webunity
ret.webunity_path = $path.resolve(__dirname, '../webunity');
ret.unodeAttrName = 'unode';


module.exports = ret;
const $c = require('./const.js');
const $glob = require('glob');
const $path = require('path');

//获取所有的gulp任务
exports.requireAllTask = function () {
    const files = $glob.sync($c.builder_path + "/tasks/*.js", {});
    files.forEach(function (file) {
        require(file);
    });
};

exports.getClearBaseName = function (path) {
    const ext = $path.extname(path);
    return $path.basename(path, ext);
};
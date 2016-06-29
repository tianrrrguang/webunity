const config = {
    src: "../webapp/",              //源代码目录
    src_template: "template",       //模板目录名
    src_template_ext: ".html",      //默认入口模本文件后缀
    src_template_resc: true,        //默认是否仅查找一层
    ejs_delimiter: "ssi",              //为了区分构建环境和运行环境，ejs使用不同的开闭字符
    src_scripts: 'scripts',         
    src_style: 'style',

    dist: '../dist/',               //输出目
    dist_auto_clear: true,           //是否自动清空dist
    dist_version: 10,               //版本
    dist_version_rename: false,       //是否使用版本重命名

    webpack_jsformat: '_js/[name]_[chunkhash:8].js',     //webpack，js文件输出规则
    webpack_cssformat: '_css/[name]_[chunkhash:8].css',     //webpack，css文件输出规则
    webpack_tempjs: './tempjs',     //webpack临时js文件目录

};

module.exports = config;
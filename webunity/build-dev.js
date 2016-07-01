const $gulp = require('gulp');
const $gulpSequence = require('gulp-sequence');

const $public = require('./public/public.js');

//引入所有gulp任务
$public.requireAllTask();

//develop任务
$gulp.task('develop', $gulpSequence(
    'entry',
    'webunity-node',
    'webunity-script',
    'webunity-style',
    'webunity-tempjs',
    'webpack'
));

$gulp.start('develop');
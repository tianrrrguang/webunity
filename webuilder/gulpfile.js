const $gulp = require('gulp');
const $public = require('./public/public.js');
const $gulpSequence = require('gulp-sequence');

//引入所有gulp任务
$public.requireAllTask();

//develop任务
$gulp.task('develop', $gulpSequence('entry', 'jscache', 'webunity-script', 'jspack'));


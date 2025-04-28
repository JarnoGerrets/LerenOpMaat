const {series, parallel, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const css = function (done) {
done();
};
const watchFiles = () => {
browserSync.init({server: {baseDir: './'}});
watch(['./style/*.css'], series(css));
//... meerdere keren watch aanroepen mag voor andere taken!
watch('./style/*.css').on('change', browserSync.reload);
};
watchFiles.displayName = 'watch';
exports.watch = watchFiles

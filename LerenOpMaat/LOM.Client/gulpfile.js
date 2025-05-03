const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const { build } = require('esbuild');
const path = require('path');

// const css = function (done) {
// done();
// };
// const watchFiles = () => {
// browserSync.init({server: {baseDir: './'}});
// watch(['./style/*.css'], series(css));
// //... meerdere keren watch aanroepen mag voor andere taken!
// watch('./style/*.css').on('change', browserSync.reload);
// };
// watchFiles.displayName = 'watch';
// exports.watch = watchFiles

function copyHtml() {
    return src('./index.html').pipe(dest('./dist'));
}

function copyTemplates() {
    return src('./src/templates/**/*').pipe(dest('./dist/templates'));
}

function copyImages() {
    return src('./images/**/*').pipe(dest('./dist/images'));
}

function copyCss() {
    return src('./style/**/*.css').pipe(dest('./dist/style'));
}

function bundleJs() {
    return build({
        entryPoints: ['./src/app.js'], // your JS entry
        bundle: true,
        outfile: './dist/bundle.js',
        sourcemap: true,
        format: 'iife', // for browser compatibility
        target: ['es2017'],
    }).catch(() => process.exit(1));
}

function reload(done) {
    browserSync.reload({});
    done();
}

function serve(done) {
    browserSync.init({ server: { baseDir: './dist' } });
    watch('./style/**/*.css', series(copyCss, reload));
    watch('./src/templates/**/*', series(copyTemplates, reload));
    watch('./src/**/*.js', series(bundleJs, reload));
    watch('./index.html', series(copyHtml, reload));
    watch('./images', series(copyImages, reload));
    watch('./*.html').on('change', browserSync.reload);
    done();
}

exports.default = series(
    copyCss,
    copyTemplates,
    bundleJs,
    copyHtml,
    copyImages,
    serve
);
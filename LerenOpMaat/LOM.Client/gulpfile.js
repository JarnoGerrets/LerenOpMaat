const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const { build } = require('esbuild');
// const path = require('path');

function copyHtml() {
    return src('./index.html').pipe(dest('./dist'));
}

function copyTemplates() {
    return src('./src/templates/**/*').pipe(dest('./dist/templates'));
}

// function copyImages() {
//     return src(['./images/**/*', './images/**/*.png'])
//         .pipe(dest('./dist/images'));
// }

function copyCss() {
    return src('./style/**/*.css').pipe(dest('./dist/style'));
}

function bundleJs() {
    return build({
        entryPoints: ['./src/app.js'],
        bundle: true,
        outfile: './dist/bundle.js',
        sourcemap: true,
        format: 'iife',
        target: ['es2017'],
        minify: true,
        treeShaking: true,
        legalComments: 'none'
    }).catch(() => process.exit(1));
}

function reload(done) {
    browserSync.reload();
    done();
}

function serve(done) {
    browserSync.init({ server: { baseDir: './dist' } });
    watch('./style/**/*.css', series(copyCss, reload));
    watch('./src/templates/**/*', series(copyTemplates, reload));
    watch('./src/**/*.js', series(bundleJs, reload));
    watch('./index.html', series(copyHtml, reload));
    // watch(['./images/**/*', './images/**/*.png'], series(copyImages, reload));
    watch('./*.html').on('change', browserSync.reload);
    done();
}

exports.default = series(
    copyCss,
    copyTemplates,
    bundleJs,
    copyHtml,
    // copyImages,
    serve
);
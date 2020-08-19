const gulp = require('gulp');
const del = require('del');
const build = require('./build');

const clean = () => {
    return del(['dist/**', '!dist']);
};
exports.build = build;
exports.clean = clean;
exports.default = gulp.series(clean, build);

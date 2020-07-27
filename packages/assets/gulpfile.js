const gulp = require('gulp')
const flatMap = require('flat-map').default
const scaleImages = require('gulp-scale-images')

const twoVariantsPerFile = (file, cb) => {
    const pngFile = file.clone()
    pngFile.scale = { maxWidth: 500, maxHeight: 500, format: 'png' }
    const jpegFile = file.clone()
    jpegFile.scale = { maxWidth: 700, format: 'jpeg' }
    cb(null, [pngFile, jpegFile])
}

const buildTask = gulp.src('src/*.{jpeg,jpg,png,gif,svg}')
    .pipe(flatMap(twoVariantsPerFile))
    .pipe(scaleImages())
    .pipe(gulp.dest('dist/'));


exports.default = buildTask;

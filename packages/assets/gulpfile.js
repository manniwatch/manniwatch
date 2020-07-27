const gulp = require('gulp')
const flatMap = require('flat-map').default
const del = require('del');
const path = require('path')
const scaleImages = require('gulp-scale-images')

const build_manifest_icons = () => {
    const twoVariantsPerFile = (file, cb) => {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const outputFiles = sizes.map((size) => {
            const pngFile = file.clone()
            pngFile.scale = {
                maxWidth: size,
                maxHeight: size,
                format: 'png',
                withoutEnlargement: false,
            };
            return pngFile;
        });

        cb(null, outputFiles)
    }
    return gulp.src('src/app_icon.svg')
        .pipe(flatMap(twoVariantsPerFile))
        .pipe(scaleImages((output, scale, cb) => {
            const fileName = path.basename(output.path, output.extname) + '_' + // strip extension
                scale.maxWidth + 'x' + scale.maxHeight + '.' +
                scale.format || output.extname;
            cb(null, fileName)
        }))
        .pipe(gulp.dest('dist/manifest'));
};

const clean = () => {
    return del(['dist/**', '!dist']);
};

const build = gulp.parallel(build_manifest_icons);
exports.build_manifest_icons = build_manifest_icons;
exports.build = build;
exports.clean = clean;
exports.default = gulp.series(clean, build);

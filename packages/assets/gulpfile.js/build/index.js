const gulp = require('gulp');
const flatMap = require('flat-map').default;
const gulpSharp = require('@donmahallem/gulp-sharp').gulpSharp;
const rename = require('gulp-rename');

const build_launcher_icons_mask = () => {
    const generateOutputFormats = (file, cb) => {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const outputFiles = sizes.map((size) => {
            const pngFile = file.clone();
            pngFile.sharp_config = {
                transform: {
                    resize: {
                        height: size,
                        width: size,
                    }
                }
            };
            return pngFile;
        });

        cb(null, outputFiles)
    }
    return gulp.src('src/app_icon.svg')
        .pipe(rename({
            basename: 'launcher',
        }))
        .pipe(flatMap(generateOutputFormats))
        .pipe(gulpSharp({
            config: { density: 1200 },
            transform: {
                format: 'png',
            }
        }))
        .pipe(gulp.dest('dist/launcher/mask'));
};

const build_launcher_icons_no_mask = () => {
    const generateOutputFormats = (file, cb) => {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const outputFiles = sizes.map((size) => {
            const pngFile = file.clone();
            pngFile.sharp_config = {
                transform: {
                    resize: {
                        height: size,
                        width: size,
                    }
                }
            };
            return pngFile;
        });

        cb(null, outputFiles)
    }
    return gulp.src('src/app_icon_no_clip.svg')
        .pipe(rename({
            basename: 'launcher',
        }))
        .pipe(flatMap(generateOutputFormats))
        .pipe(gulpSharp({
            config: { density: 1200 },
            transform: {
                format: 'png',
            }
        }))
        .pipe(gulp.dest('dist/launcher/no_mask'));
};

const copy_svgs = () => {
    return gulp.src('src/*.svg')
        .pipe(gulp.dest('dist/svg'));
};
const build_launcher_icons = gulp.parallel(build_launcher_icons_mask, build_launcher_icons_no_mask);
const build = gulp.parallel(build_launcher_icons, copy_svgs);
exports.build_launcher_icons = build_launcher_icons;
exports.copy_svgs = copy_svgs;
exports.build = build;
module.exports = build

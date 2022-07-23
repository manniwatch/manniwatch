import gulp from 'gulp';
import { default as flatMap } from 'flat-map';
import { gulpSharp } from '@donmahallem/gulp-sharp';
import { default as rename } from 'gulp-rename';
import { default as svgmin } from 'gulp-svgmin';

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
                    },
                },
            };
            return pngFile;
        });

        cb(null, outputFiles);
    };
    return gulp
        .src('src/app_icon.svg')
        .pipe(
            rename({
                basename: 'launcher',
            })
        )
        .pipe(flatMap.default(generateOutputFormats))
        .pipe(
            gulpSharp({
                config: { density: 1200 },
                transform: {
                    format: 'png',
                },
            })
        )
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
                    },
                },
            };
            return pngFile;
        });

        cb(null, outputFiles);
    };
    return gulp
        .src('src/app_icon_no_clip.svg')
        .pipe(
            rename({
                basename: 'launcher',
            })
        )
        .pipe(flatMap.default(generateOutputFormats))
        .pipe(
            gulpSharp({
                config: { density: 1200 },
                transform: {
                    format: 'png',
                },
            })
        )
        .pipe(gulp.dest('dist/launcher/no_mask'));
};

const copy_svgs = () => {
    return gulp.src('src/*.svg').pipe(svgmin()).pipe(gulp.dest('dist/svg'));
};
const build_launcher_icons = gulp.parallel(build_launcher_icons_mask, build_launcher_icons_no_mask);
const build = gulp.parallel(build_launcher_icons, copy_svgs);
export { build_launcher_icons, copy_svgs, build, build as default };

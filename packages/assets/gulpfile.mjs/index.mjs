import gulp from 'gulp';
import { deleteAsync } from 'del';
import { build } from './build/index.mjs';

export const clean = async () => {
    return deleteAsync(['dist/**', '!dist']);
};
const defaultAction = gulp.series(clean, build);
export { defaultAction as default };

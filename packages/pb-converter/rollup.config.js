import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';
//import { terser } from "rollup-plugin-terser";
export default {
    input: 'src/index.ts', // our source file
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: "named"
        },
        {
            file: pkg.module,
            format: 'es', // the preferred format
            sourcemap: true,
            exports: "named"
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        nodeResolve(),
        commonjs({
            include: [
                'node_modules/**'
            ],
        }),
        typescript({
            tsconfig: './tsconfig.json',
        })]
};

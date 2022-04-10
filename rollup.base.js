import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import path from 'path';

import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }));
const defaults = {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})],
    preserveSymlinks: true,
};

export default [
    {
        ...defaults,
        output: [
            {
                dir: './dist/cjs',
                format: 'cjs',
                sourcemap: true,
                preferConst: true,
                preserveModules: true,
                preserveModulesRoot: './src',
                entryFileNames: '[name].cjs',
            },
            {
                dir: './dist/esm',
                format: 'es',
                sourcemap: true,
                preferConst: true,
                preserveModules: true,
                preserveModulesRoot: './src',
                entryFileNames: '[name].mjs',
            },
        ],
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript({
                tsconfig: './tsconfig.lib.json',
                outDir: null,
                declaration: false,
                declarationDir: null,
                sourceMap: true,
                module: 'ESNext',
            }),
            commonjs(),
            json({ compact: true }),
            del({ targets: ['dist/esm/*', 'dist/cjs/*'] }),
        ],
    },
    {
        ...defaults,
        plugins: [
            nodeResolve({ preferBuiltins: true, rootDir: path.join(process.cwd(), '../..') }),
            typescript({
                tsconfig: './tsconfig.lib.json',
                declaration: true,
                emitDeclarationOnly: true,
                outDir: './dist/types',
                module: 'ESNext',
            }),
            commonjs(),
            json({ compact: true }),
            del({ targets: 'dist/types/*', hook: 'buildStart' }),
            del({ targets: ['dist/types/**', '!dist/types', '!dist/types/**/*.d.ts'], hook: 'writeBundle' }),
        ],
        output: [{ dir: 'dist/types', format: 'es', sourcemap: true }],
    },
];
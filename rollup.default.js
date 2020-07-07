import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default (pkg) => {
    const output = [];
    if (pkg.main) {
        output.push({
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            preferConst: true,
            footer: '// BUILD: __BUILD_DATE__\n\n'
        });
    }
    if (pkg.module) {
        output.push({
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
            preferConst: true,
            footer: '// BUILD: __BUILD_DATE__\n\n'
        });
    }
    return {
        input: 'src/index.ts',
        output,
        external: [
            ...Object.keys(pkg.dependencies || {})
        ],
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: './tsconfig.json',
            }),
            replace({
                __BUILD_DATE__: () => new Date(),
                __BUILD_VERSION__: pkg.version,
            })
        ]
    }
}

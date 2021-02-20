import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
//import { terser } from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';
import css from 'rollup-plugin-css-only';
//import gzipPlugin from 'rollup-plugin-gzip';
import json from 'rollup-plugin-json';
import typescript from '@rollup/plugin-typescript';
import sirv from 'sirv-cli';
import pkg from './package.json';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

const plugins = [
    css({ output: `bundle${production ? '.min' : ''}.css` }),
    json({
        compact: true,
        preferConst: true
    }),
    resolve({browser: true}),
    commonjs(),
    !production && livereload('dist'),
    !production && sirv('dist', { port: 6060 }),
    //production && terser(),
    //production && gzipPlugin(),
    includePaths({ paths: ["src"] })
];

const externals = [
    'container/config',
    'container/security',
    'container/auth',
    'container/busybar',
    'container/http',
    'container/i18n',
    'container/application'
];

export default [
    /*{
        input: './src/index.ts',
        output: {
            sourcemap: !production,
            format: 'umd',
            name: 'boostWebCore',
            dir: path.dirname(pkg.browser),
            file: `${pkg.browser}`
        },
        plugins: [
            ...plugins,
            includePaths({ paths: ["src"] })
        ],
        external: ['container']
    },*/
    {
        input: './src/index.ts',
        output: {
            dir: path.dirname(pkg.module),
            //file: pkg.module,
            format: 'es',
            sourcemap: !production
        },
        plugins: [
            ...plugins,
            typescript({
                sourceMap: !production,
                inlineSources: !production,
                declaration: true,
                declarationDir: 'dist/types'
            }),
        ],
        external: externals
    },
    {
        input: './src/index.ts',
        output: {
            file: pkg.main,
            format: 'cjs',
            sourcemap: !production
        },
        plugins: [
            ...plugins,
            typescript({
                sourceMap: !production,
                inlineSources: !production,
            }),
        ],
        external: externals
    }
]
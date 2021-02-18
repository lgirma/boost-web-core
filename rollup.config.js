import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';
import css from 'rollup-plugin-css-only';
import gzipPlugin from 'rollup-plugin-gzip';
import json from 'rollup-plugin-json';
import typescript from '@rollup/plugin-typescript';
import sirv from 'sirv-cli';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const plugins = [
    css({ output: `bundle${production ? '.min' : ''}.css` }),
    json({
        compact: true,
        preferConst: true
    }),
    resolve({browser: true}),
    commonjs(),
    typescript({
        sourceMap: !production,
        inlineSources: !production
    }),
    !production && livereload('dist'),
    !production && sirv('dist', { port: 6060 }),
    production && terser(),
    production && gzipPlugin()
];

export default [
    {
        input: './src/index.ts',
        output: {
            sourcemap: !production,
            format: 'umd',
            name: 'boostWeb',
            file: `${pkg.browser}`
        },
        plugins: [
            ...plugins,
            includePaths({ paths: ["src"] })
        ],
        external: ['container']
    },
    {
        input: './src/index.ts',
        output: [
            { 
                file: `${pkg.main}`,
                format: 'cjs',
                sourcemap: !production
            },
            {
                file: `${pkg.module}`,
                format: 'es',
                sourcemap: !production
            }
        ],
        plugins: [
            ...plugins,
            includePaths({ paths: ["src"] })
        ],
        external: [
            'container/config',
            'container/security',
            'container/auth',
            'container/busybar',
            'container/http',
            'container/i18n',
            'container/application'
        ]
    }
]
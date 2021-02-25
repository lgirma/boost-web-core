import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import {module, main} from './package.json'

const production = !process.env.ROLLUP_WATCH;

const output = (file, format) => ({
    format, file,
    sourcemap: !production
});

export default {
    input: './src/index.ts',
    output: [
        output(module, 'esm'),
        output(main, 'cjs')
    ],
    plugins: [
        resolve({browser: true}),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
            declaration: false
        })
    ],
    external: [
        'container/auth',
        'container/busybar',
        'container/config',
        'container/icon',
        'container/security',
        'container/http',
        'container/i18n'
    ]
}



const esBuild = require('esbuild')
const watch = process.env.WATCH === '1'

if (watch)
    console.log('Watching...')

const config = format => ({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: `dist/index.${format}.js`,
    format,
    logLevel: 'warning',
    watch
})

esBuild.build(config('cjs'))
    .catch(() => process.exit(1));

esBuild.build(config('esm'))
    .catch(() => process.exit(1));
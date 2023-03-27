import { nodeResolve } from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: {
    file: 'test/uiik.js',
    format: 'esm',
    banner: `/* ${pkg.name} ${pkg.version} @${pkg.author} ${pkg.repository.url} */`,
  },
  plugins: [
    nodeResolve(),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: './dist/types',
        },
      },
    }),
    serve({
      open: true,
      openPage: '/test/index.html',
      host: 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
    livereload('test'),
    json(),
  ],
}

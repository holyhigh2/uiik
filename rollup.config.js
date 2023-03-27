/* eslint-disable max-len */
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import banner2 from 'rollup-plugin-banner2'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'
const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  external: ['@holyhigh/func.js'],
  plugins: [
    nodeResolve(),
    clear({
      targets: ['dist'],
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: './dist/types',
        },
      },
    }),
    commonjs(),
    // terser(),
    banner2(
      () => `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.repository.url}
 * c) 2021-${new Date().getFullYear()} @${pkg.author
    } may be freely distributed under the MIT license
 */
`
    ),
    json(),
    copy({
      targets: [
        {
          src: [
            'CHANGELOG.md',
            'LICENSE',
            'README.md',
            'package.json',
            '.npmignore',
          ],
          dest: 'dist',
        }
      ],
    }),
  ],
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'uiik'
    }
  ],
}

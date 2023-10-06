/* eslint-disable max-len */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import banner2 from "rollup-plugin-banner2";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import typescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";
import terser from '@rollup/plugin-terser'
const pkg = require("./package.json");

export default {
  input: "src/index.ts",
  external: ["myfx.*"],
  plugins: [
    clear({
      targets: ["dist"],
      watch: true,
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          removeComments: true,
        },
      },
    }),
    commonjs(),
    nodeResolve(),
    banner2(
      () => `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.repository.url}
 * c) 2021-${new Date().getFullYear()} @${
        pkg.author
      } may be freely distributed under the MIT license
 */
`
    ),
    json(),
    copy({
      targets: [
        {
          src: [
            "CHANGELOG.md",
            "LICENSE",
            "README.md",
          ],
          dest: "dist",
        },
      ],
    }),
  ],
  output: [
    {
      file: "dist/uiik.js",
      format: "umd",
      name: "uiik",
    },
    {
      file: "dist/uiik.min.js",
      format: "umd",
      name: "uiik",
      plugins: [terser()],
    },
  ],
};

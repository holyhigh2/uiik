/* eslint-disable max-len */
import commonjs from "@rollup/plugin-commonjs";
import banner2 from "rollup-plugin-banner2";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import typescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";
const pkg = require("./package.json");
const fs = require("fs");
const path = require("path");

process.on("exit", () => {
  const files = fs.readdirSync("./dist");

  // 扁平化
  files.forEach((item, index) => {
    const fullpath = path.join("dist", item);
    const stat = fs.statSync(fullpath);
    if (!stat.isDirectory()) {
      return;
    }

    fs.readdirSync(fullpath).forEach((fileName) => {
      fs.copyFileSync(path.join(fullpath, fileName), "./dist/" + fileName);
    });
    fs.rmSync(fullpath, { recursive: true });
  });
});

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
          removeComments:true,
          declaration: true
        },
      },
    }),
    commonjs(),
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
            "package.json",
            ".npmignore",
          ],
          dest: "dist",
        },
      ],
    }),
  ],
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
    {
      file: "dist/index.js",
      format: "umd",
      name: "uiik"
    },
  ],
};

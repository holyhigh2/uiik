import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import { external } from "./vite.shared.mjs";

/**
 * 按模块产出 ESM，让 `import { newSortable } from "uiik/sortable"` 这类子路径
 * 真正可用——过去只发了 dist/sortable.d.ts，类型能过而运行时会解析失败。
 *
 * 用 preserveModules：不打包、不重复，每个源模块一个文件，模块之间相对引用。
 * 根入口仍叫 index.esm.js，所以 package.json 的 module 字段不用改，
 * 现有的根入口导入不受影响。
 *
 * 依赖 vite.config.mjs 已经建好 dist，所以这里不能 emptyOutDir。
 */
const input = {};
for (const file of readdirSync("src")) {
  if (!file.endsWith(".ts")) continue;
  const name = file.replace(/\.ts$/, "");
  input[name] = `src/${file}`;
}

export default defineConfig({
  build: {
    target: "es2018",
    outDir: "dist",
    emptyOutDir: false,
    minify: false,
    rolldownOptions: {
      input,
      external,
      // 同 vite.config.mjs：不加会把入口上没人引用的导出（VERSION、default）摇掉
      preserveEntrySignatures: "strict",
      output: {
        dir: "dist",
        format: "es",
        preserveModules: true,
        // 根入口沿用旧文件名 index.esm.js，避开 UMD 的 index.js
        entryFileNames: (chunk) =>
          chunk.name === "index" ? "index.esm.js" : "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
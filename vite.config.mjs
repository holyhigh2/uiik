import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { external, umdOutput } from "./vite.shared.mjs";

// 主构建：UMD（含压缩版）+ 类型声明 + 随包文件。
// 按模块的 ESM 产物（uiik/sortable 这类子路径）由 vite.config.esm.mjs 生成，
// 本配置必须先跑，因为它负责 emptyOutDir。
export default defineConfig({
  build: {
    target: "es2018",
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    rolldownOptions: {
      input: "src/index.ts",
      external,
      // 不加这个，UMD 会被当成应用入口摇树，把所有导出都删掉，
      // 只剩 droppable 的副作用和欢迎横幅
      preserveEntrySignatures: "strict",
      output: [
        {
          ...umdOutput,
          dir: "dist",
          format: "umd",
          name: "uiik",
          entryFileNames: "index.js",
          // 同时有具名与 default 导出时必须显式指定，否则 UMD 使用者
          // 只能通过 uiik.default 取到默认导出
          exports: "named",
        },
        {
          // 压缩版供 CDN / <script> 直接引用，随包发布即可由 unpkg 取到
          ...umdOutput,
          dir: "dist",
          format: "umd",
          name: "uiik",
          entryFileNames: "uiik.min.js",
          exports: "named",
          plugins: [terser()],
        },
      ],
    },
  },
  plugins: [
    dts({
      outDirs: ["dist"],
      entryRoot: "src",
      include: ["src"],
      exclude: ["website", "spec", "node_modules"],
      insertTypesEntry: false,
      copyDtsFiles: false,
      strictOutput: true,
    })
  ],
});
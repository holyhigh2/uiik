/**
 * 发布静态站点：把 website/ 打包成可直接丢进 HTTP 容器 / CDN 的目录
 *
 * 产物在 dist-website/，扁平结构、与 website/ 同名：
 *   dist-website/index.html        首页
 *   dist-website/index-dom.html    DOM 示例
 *   dist-website/index-svg.html    SVG 示例
 *   dist-website/index-api.html    API 查询
 *   dist-website/demo.css|.js       样式与运行时
 *   dist-website/*-demo.js         各页逻辑
 *   dist-website/uiik.js           由 src 构建的库（ESM）
 *
 * 只带 .html/.css/.js，纯 ESM + 相对路径，不需要打包器或服务端渲染，
 * 丢进任意静态服务器即可。单元测试（spec/）与构建产物（dist/）都不包含。
 */
import { build } from "vite";
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC = "website";
const OUT = "dist-website";
/** 只有这三类文件是站点需要的 */
const KEEP = [".html", ".css", ".js"];

const bytes = async (dir) => {
  let total = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    total += e.isDirectory() ? await bytes(p) : (await stat(p)).size;
  }
  return total;
};

// 1) 构建库到 website/uiik.js
// 关掉监听：vite 的 build() 在 watch 模式下不会返回
process.env.WEBSITE_WATCH = "off";
await build({ configFile: "vite.config.website.mjs" });

// 2) 只把站点文件复制出去
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => KEEP.includes(f.slice(f.lastIndexOf("."))));
if (!files.some((f) => f.endsWith(".html"))) {
  throw new Error(`${SRC}/ 里没有 .html，站点源目录不对`);
}
for (const f of files) {
  await cp(join(SRC, f), join(OUT, f));
}

const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log(`\n${OUT}/ 已生成，共 ${files.length} 个文件 / ${kb(await bytes(OUT))}`);
for (const f of files.sort()) {
  console.log("  " + f);
}
console.log("\n把这个目录整个放到任意静态服务器（或 CDN）的站点根下即可。");

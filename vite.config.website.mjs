import { defineConfig } from "vite";
import { devBanner } from "./vite.shared.mjs";

export default defineConfig(() => {
  // 监听只给 npm run website 用；npm run website:build 走一次性构建，
  // 否则 vite 的 build() 在监听模式下不会返回
  const watch = process.env.WEBSITE_WATCH === "off" ? null : {};
  return {
    build: {
      target: "es2018",
      outDir: "website",
      emptyOutDir: false,
      minify: false,
      watch,
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
        fileName: () => "uiik.js",
      },
      rolldownOptions: {
        output: {
          banner: devBanner,
        },
      },
    },
    server: {
      host: "localhost",
      port: 8819,
      open: "/website/index.html",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
});

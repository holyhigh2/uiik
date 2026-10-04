/**
 * 本地开发：构建库到 website/uiik.js 并启动静态服务器（带热更新）
 * 发布静态站点用 npm run website:build
 */
import { build, createServer } from "vite";

const configFile = "vite.config.website.mjs";

const watcher = await build({ configFile });
const server = await createServer({ configFile });
await server.listen();

const shutdown = async () => {
  await server.close();
  await watcher.close();
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
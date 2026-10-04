/**
 * 让 Node 能直接跑 src 下的 TS 源码。
 *
 * src/*.ts 之间是扩展名省略的相对导入（`./types`），那是打包器与
 * TypeScript 的写法，Node 的 ESM 解析器不认。这里在解析失败时补一次 .ts，
 * 于是单元测试可以像 geometry.spec.ts 那样直接 import 源码，
 * 不必先构建产物。
 */
const HAS_EXT = /\.[cm]?[jt]sx?$|\.json$/;

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    if (!relative || HAS_EXT.test(specifier)) throw err;
    return nextResolve(`${specifier}.ts`, context);
  }
}
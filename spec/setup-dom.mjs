/**
 * node:test 的预加载模块：在任何 spec 之前把 jsdom 装到全局。
 *
 * 必须用 --import 而不是在 spec 里 import：uiik 的模块在被 import 时就会
 * 访问 document（droppable.ts 顶层就 document.addEventListener），
 * 所以全局 DOM 要先于模块求值就绪。
 *
 * jsdom 没有布局，所有 getBoundingClientRect() 返回 0，
 * 因此用例只覆盖事件驱动与状态标记，不覆盖几何。
 */
import { register } from "node:module";
import { JSDOM, VirtualConsole } from "jsdom";

// 先装解析钩子，让 src/*.ts 的扩展名省略导入能被 Node 解析
register("./ts-resolve.mjs", import.meta.url);

/**
 * 事件监听器里抛出的异常不会从 dispatchEvent() 冒泡出来 ——
 * jsdom 与真实浏览器一样会把它交给 unhandled-error 通道。
 * 所以「不该抛错」这类断言必须挂到 jsdom 的 jsdomError 上，
 * 否则 assert.doesNotThrow(() => el.dispatchEvent(...)) 永远是绿的。
 */
const uncaught = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (err) => {
  uncaught.push(err && err.detail ? err.detail : err);
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
  url: "http://localhost/",
  virtualConsole,
});

/** 把 jsdom 的窗口对象铺到 globalThis 上 */
const skip = new Set(["undefined", "globalThis", "global"]);
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (skip.has(key)) continue;
  if (key in globalThis) continue;
  Object.defineProperty(globalThis, key, {
    configurable: true,
    get: () => dom.window[key],
  });
}

// document / window 这几个必须直接覆盖，不能沿用 Node 侧的同名属性
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLCollection",
  "NodeList",
  "MouseEvent",
  "KeyboardEvent",
  "Event",
  "CustomEvent",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "Node",
  "Element",
  "SVGElement",
  "SVGSVGElement",
  "WeakMap",
]) {
  const from = dom.window[key];
  if (from === undefined) continue;
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value: typeof from === "function" && !from.prototype ? from.bind(dom.window) : from,
  });
}

/** jsdom 未实现的动画帧：给一个立即执行的可控桩 */
let rafId = 1;
globalThis.requestAnimationFrame = (cb) => {
  const id = rafId++;
  setTimeout(() => cb(Date.now()), 0);
  return id;
};
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

/** 每个用例之间清空 body 与已捕获的异常，避免互相污染 */
globalThis.__resetDom = () => {
  dom.window.document.body.innerHTML = "";
  uncaught.length = 0;
};

/** 取走并清空「监听器里抛出、未冒泡」的异常 */
globalThis.__takeUncaught = () => uncaught.splice(0, uncaught.length);

process.on("exit", () => dom.window.close());
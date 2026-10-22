/**
 * pointer-drag 单元测试
 *
 * 运行：npm run test:unit（spec/）
 * DOM 来自 spec/setup-dom.mjs 预加载的 jsdom（无布局，故用注入矩形做命中）。
 */

import * as assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import type { DragTarget } from "../src/pointer-drag.ts";
import { beginPointerDrag } from "../src/pointer-drag.ts";

interface Harness {
  __resetDom: () => void;
}
const h = globalThis as unknown as Harness;

beforeEach(() => h.__resetDom());

const TARGETS: DragTarget<string>[] = [
  { rect: { x: 0, y: 0, w: 100, h: 100 }, data: "a" },
  { rect: { x: 200, y: 0, w: 100, h: 100 }, data: "b" },
];

const down = (x = 0, y = 0) => new MouseEvent("mousedown", { clientX: x, clientY: y, buttons: 1 });
const move = (x: number, y: number, buttons = 1) =>
  document.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: y, buttons }));
const up = (x: number, y: number) => document.dispatchEvent(new MouseEvent("mouseup", { clientX: x, clientY: y, buttons: 0 }));

test("阈值内松开视为点击，不进入拖拽", () => {
  let started = false;
  let clicked = 0;
  let dropped = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onStart: () => (started = true),
    onClick: () => clicked++,
    onDrop: () => dropped++,
  });
  move(2, 2);
  up(2, 2);
  assert.equal(started, false);
  assert.equal(clicked, 1);
  assert.equal(dropped, 0);
});

test("越过阈值进入拖拽：移动与落位命中缓存矩形", () => {
  let started = false;
  let ended = 0;
  const hits: (string | null)[] = [];
  let dropHit: string | null | undefined;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onStart: () => (started = true),
    onMove: (hit) => hits.push(hit),
    onDrop: (hit) => (dropHit = hit),
    onEnd: () => ended++,
  });
  move(250, 50); // 落在 b
  up(250, 50);
  assert.equal(started, true);
  assert.equal(hits.at(-1), "b");
  assert.equal(dropHit, "b");
  assert.equal(ended, 1);
});

test("落点在目标之外时 hit 为 null", () => {
  let dropHit: string | null | undefined = "unset";
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onDrop: (hit) => (dropHit = hit),
  });
  move(500, 500);
  up(500, 500);
  assert.equal(dropHit, null);
});

test("拖拽中 buttons 归零 → 取消，不落位", () => {
  let cancelled = 0;
  let ended = 0;
  let dropped = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
    onEnd: () => ended++,
    onDrop: () => dropped++,
  });
  move(250, 50);
  move(250, 50, 0); // 按钮丢失
  assert.equal(cancelled, 1);
  assert.equal(ended, 1);
  assert.equal(dropped, 0);
});

test("指针离开视口 → 取消", () => {
  let cancelled = 0;
  let ended = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
    onEnd: () => ended++,
  });
  move(250, 50);
  document.documentElement.dispatchEvent(new MouseEvent("mouseleave"));
  assert.equal(cancelled, 1);
  assert.equal(ended, 1);
});

test("窗口失焦 → 取消", () => {
  let cancelled = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
  });
  move(250, 50);
  window.dispatchEvent(new Event("blur"));
  assert.equal(cancelled, 1);
});

test("未进入拖拽时离开视口不触发取消", () => {
  let cancelled = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
  });
  document.documentElement.dispatchEvent(new MouseEvent("mouseleave"));
  assert.equal(cancelled, 0);
});

test("收尾顺序：先 onEnd 再 onDrop", () => {
  const order: string[] = [];
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onEnd: () => order.push("end"),
    onDrop: () => order.push("drop"),
  });
  move(250, 50);
  up(250, 50);
  assert.deepEqual(order, ["end", "drop"]);
});

test("新会话抢占：上一次拖拽被取消并收尾", () => {
  let cancelled = 0;
  let ended = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
    onEnd: () => ended++,
  });
  move(250, 50); // 已进入拖拽
  beginPointerDrag<string>({ ev: down(), targets: () => TARGETS });
  assert.equal(cancelled, 1);
  assert.equal(ended, 1);
});

test("返回的清理函数可主动取消", () => {
  let cancelled = 0;
  const cleanup = beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onCancel: () => cancelled++,
  });
  move(250, 50);
  cleanup();
  assert.equal(cancelled, 1);
});

test("未监听前按钮丢失不残留监听（释放后移动无反应）", () => {
  let clicked = 0;
  beginPointerDrag<string>({
    ev: down(),
    targets: () => TARGETS,
    onClick: () => clicked++,
  });
  move(3, 3, 0); // 阈值内但按钮已松 → 静默收尾
  up(3, 3); // 监听已移除，不应再触发点击
  assert.equal(clicked, 0);
});

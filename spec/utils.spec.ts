/**
 * utils 单元测试
 *
 * 运行：npm run test:unit（spec/）
 * DOM 来自 spec/setup-dom.mjs 预加载的 jsdom（无布局，getBoundingClientRect 恒 0），
 * 故此处只覆盖「探针零残留 / 回落 body / 无布局时原点为 0」这类 DOM 契约，
 * 真实包含块偏移由浏览器探针验证。
 */

import * as assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { containingBlockOrigin } from "../src/utils.ts";

interface Harness {
  __resetDom: () => void;
}
const h = globalThis as unknown as Harness;

beforeEach(() => h.__resetDom());

test("containingBlockOrigin: jsdom 无布局时返回原点 (0,0)", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const o = containingBlockOrigin(host);
  assert.equal(o.x, 0);
  assert.equal(o.y, 0);
});

test("containingBlockOrigin: 探针不残留在参照元素内", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const before = host.childNodes.length;
  containingBlockOrigin(host);
  assert.equal(host.childNodes.length, before);
  assert.equal(document.querySelectorAll("body div").length, 1);
});

test("containingBlockOrigin: 无 parentNode 时回落到 body（不抛错）", () => {
  const detached = document.createElement("div");
  const o = containingBlockOrigin(detached);
  assert.equal(o.x, 0);
  assert.equal(o.y, 0);
});

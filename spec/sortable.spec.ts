/**
 * sortable 单元测试
 *
 * 运行：npm run test:unit（spec/）
 * DOM 来自 spec/setup-dom.mjs 预加载的 jsdom。
 *
 * 两个要点：
 * 1) 监听器里抛出的异常不会从 dispatchEvent 冒泡（jsdom 与浏览器一致），
 *    所以断言「不抛错」要查 __takeUncaught()，不能靠 doesNotThrow。
 * 2) 跨容器搬运只有在 move.to 为真时才会走到 active()；不写 move.to 时
 *    moveMode 为 false，那段代码根本不会执行，测不到东西。
 *
 * jsdom 没有布局，getBoundingClientRect() 恒为 0，
 * 因此只覆盖「事件驱动 + 状态标记」这一层。
 */

import * as assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { newSortable } from "../src/sortable.ts";

interface Harness {
  __resetDom: () => void;
  __takeUncaught: () => unknown[];
}
const h = globalThis as unknown as Harness;

/** 建一个列表容器 */
function mountList(id: string, items: string[], withGrip = false): HTMLElement {
  const ul = document.createElement("ul");
  ul.id = id;
  for (const text of items) {
    const li = document.createElement("li");
    li.textContent = text;
    if (withGrip) {
      const grip = document.createElement("i");
      grip.className = "grip";
      li.append(grip);
    }
    ul.append(li);
  }
  document.body.append(ul);
  return ul;
}

interface Pt {
  clientX: number;
  clientY: number;
}

function fire(el: EventTarget, type: string, init: Pt = { clientX: 0, clientY: 0 }) {
  el.dispatchEvent(
    new MouseEvent(type, { bubbles: true, cancelable: true, ...init })
  );
}

/** 在元素上按下并移动，模拟起拖（位移超过 THRESHOLD 即可） */
function startDrag(item: Element, dx = 40) {
  fire(item, "mousedown");
  for (let i = 1; i <= 4; i++) {
    fire(document, "mousemove", { clientX: dx * i, clientY: dx * i });
  }
}

const active = (id: string) =>
  document.getElementById(id)?.getAttribute("uii-sortable-active") ?? null;

/** 断言整段交互没有产生未捕获异常 */
function assertNoUncaught(what: string) {
  const errs = h.__takeUncaught();
  assert.deepEqual(
    errs.map((e) => String((e as Error)?.message ?? e)),
    [],
    `${what} 不应有未捕获异常`
  );
}

beforeEach(() => h.__resetDom());

/* ------------------------------------------------------------------ *
 * 回归 1：handle 选不中时不能抛错
 * 曾写成 findIndex(handles, h => h.contains(t))，而 handles 全是 null，
 * 于是一次 mousedown 就抛 TypeError，整个容器的交互全废。
 * ------------------------------------------------------------------ */
test("handle 无命中：mousedown 不产生未捕获异常", () => {
  const ul = mountList("h1", ["A", "B", "C"]);
  newSortable(ul, { handle: ".no-such-handle" });

  fire(ul.firstElementChild!, "mousedown");
  assertNoUncaught("handle 无命中时 mousedown");
});

test("handle 无命中：整段拖动不产生未捕获异常", () => {
  const ul = mountList("h2", ["A", "B"]);
  newSortable(ul, { handle: ".no-such-handle" });

  startDrag(ul.firstElementChild!);
  assertNoUncaught("handle 无命中时拖动");
  assert.equal(document.querySelectorAll(".uii-sortable-ghost").length, 0);
});

test("handle 无命中：部分条目有握把时，有握把的仍可拖", () => {
  const ul = mountList("h3", ["A", "B"], true);
  // 第三个条目故意没有握把
  const bare = document.createElement("li");
  bare.textContent = "C";
  ul.append(bare);
  newSortable(ul, { handle: ".grip" });

  startDrag(ul.querySelector(".grip")!);
  assertNoUncaught("部分条目缺握把时拖有握把的条目");
  assert.equal(
    document.querySelectorAll(".uii-sortable-ghost").length,
    1,
    "有握把的条目应能起拖"
  );
});

test("handle 命中子节点时可正常起拖", () => {
  const ul = mountList("h4", ["A", "B"], true);
  newSortable(ul, { handle: ".grip" });

  startDrag(ul.querySelector(".grip")!);

  assert.equal(document.querySelectorAll(".uii-sortable-ghost").length, 1);
  assertNoUncaught("handle 命中时拖动");
});

/* ------------------------------------------------------------------ *
 * 回归 2：move.to 为函数时，跨容器搬运必须真的可用
 * 曾把 copy! 传给 active()，而非 copy 模式下 copy 是 undefined，
 * 于是 move.from 回调拿到 undefined 抛错，目标容器拿不到 active 标记，
 * 跨列搬运整体失效。
 * ------------------------------------------------------------------ */
test("move.to 为函数：目标容器被标记为可移入", () => {
  const a = mountList("m1", ["1", "2"]);
  mountList("m2", ["3"]);
  newSortable("#m1, #m2", {
    group: "g1",
    move: {
      to: () => true,
      // 必须像真实用法一样读 item：move.from 默认是 true（恒真），
      // 那样即使传进来的是 undefined 也不会被解引用，测不到那个 bug
      from: (item) => !!(item as HTMLElement)?.textContent,
    },
  });

  startDrag(a.firstElementChild!);

  assertNoUncaught("move.to 为函数时起拖");
  assert.equal(active("m1"), null, "源容器不应被标记");
  assert.equal(active("m2"), "1", "目标容器应被标记为可移入");
});

test("move.to 为函数：move.from 收到的 item 是真实元素", () => {
  const a = mountList("m3", ["x"]);
  mountList("m4", ["y"]);
  const seen: Array<[unknown, unknown, unknown]> = [];

  newSortable("#m3, #m4", {
    group: "g2",
    move: {
      to: () => true,
      // 演示里会读 item.textContent；收到 undefined 就会抛
      from: (item, from, to) => {
        seen.push([item, from, to]);
        return !!(item as HTMLElement)?.textContent;
      },
    },
  });

  startDrag(a.firstElementChild!);

  assertNoUncaught("move.from 回调");
  assert.ok(seen.length > 0, "move.from 应被调用");
  for (const [item, from, to] of seen) {
    assert.ok(
      item instanceof HTMLElement,
      `move.from 的 item 必须是元素，实际 ${String(item)}`
    );
    assert.equal((from as HTMLElement)?.id, "m3");
    assert.equal((to as HTMLElement)?.id, "m4");
  }
});

test("move.to 为函数：多个目标容器按 move.from 各自筛选", () => {
  const a = mountList("m5", ["1"]);
  mountList("m6", ["2"]);
  mountList("m7", ["3"]);
  newSortable("#m5, #m6, #m7", {
    group: "g3",
    move: { to: () => true, from: (_i, _f, to) => to.id !== "m6" },
  });

  startDrag(a.firstElementChild!);

  assertNoUncaught("多目标容器筛选");
  assert.equal(active("m6"), null, "被 from 拒绝的容器不应激活");
  assert.equal(active("m7"), "1", "允许移入的容器应激活");
});

test("move.to 为 false：不激活任何目标容器", () => {
  const a = mountList("m8", ["1"]);
  mountList("m9", ["2"]);
  newSortable("#m8, #m9", { group: "g4", move: { to: false } });

  startDrag(a.firstElementChild!);

  assertNoUncaught("move.to 为 false 时起拖");
  assert.equal(active("m9"), null, "禁止移出时不应激活目标");
});

test("move.to 返回 false 的条目不激活目标容器", () => {
  const a = mountList("m10", ["locked", "free"]);
  mountList("m11", ["2"]);
  newSortable("#m10, #m11", {
    group: "g5",
    move: { to: (item) => item?.textContent !== "locked" },
  });

  startDrag(a.firstElementChild!); // locked
  assertNoUncaught("锁定条目起拖");
  assert.equal(active("m11"), null, "锁定条目不应激活目标");

  h.__takeUncaught();
  startDrag(a.children[1] as Element); // free
  assertNoUncaught("自由条目起拖");
  assert.equal(active("m11"), "1", "自由条目应激活目标");
});

test("move.to 为 'copy'：移动的是副本，原元素留在原容器", () => {
  const a = mountList("m12", ["only"]);
  mountList("m13", []);
  newSortable("#m12, #m13", { group: "g6", move: { to: "copy" } });

  startDrag(a.firstElementChild!);

  assertNoUncaught("copy 模式起拖");
  // ghost 是副本，落位前挂在容器里，所以不能断言 children 数量
  assert.equal(document.querySelectorAll(".uii-sortable-ghost").length, 1);
  const original = document.querySelector("#m12 > li:not(.uii-sortable-ghost)");
  assert.ok(original, "原元素应仍在源容器内");
  assert.equal(original.textContent, "only");
  assert.equal(
    original.classList.contains("uii-sortable-active"),
    false,
    "copy 模式下原元素不应被标记为 active"
  );
});

test("单容器 sortable：起拖与落位不产生未捕获异常", () => {
  const ul = mountList("s1", ["a", "b", "c"]);
  newSortable(ul);

  fire(ul.firstElementChild!, "mousedown");
  for (let i = 1; i <= 6; i++) {
    fire(document, "mousemove", { clientX: i * 12, clientY: i * 12 });
  }
  fire(document, "mouseup");
  assertNoUncaught("单容器排序");
});
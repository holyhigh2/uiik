/**
 * uiik · API 查询页
 *
 * 列表直接来自模块的真实导出（import * as uiik），因此不会与代码脱节；
 * 分组与说明来自 ./api-meta.js（与首页共用一份），并做一致性自检。
 */
import { buildApiRows, groupOrder, FALLBACK_GROUP } from "./api-meta.js";
import { describe } from "./api-detail.js";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

async function copy(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* 走降级 */
  }
  try {
    const ta = el("textarea", { style: "position:fixed;opacity:0;pointer-events:none" });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

(async function main() {
  const uiik = await import("./uiik.js");
  document.getElementById("version").textContent = "v" + uiik.VERSION;

  // 元数据是手工维护的，漏写或写了已删除的导出都要能被发现
  const { rows, missing, stale } = buildApiRows(uiik);
  if (missing.length || stale.length) {
    console.warn("[api] 元数据与实际导出不一致", { missing, stale });
  }

  const totalEl = document.getElementById("api-total");
  const listEl = document.getElementById("api-list");
  const searchEl = document.getElementById("api-search");
  const groupBar = document.getElementById("api-groups");

  totalEl.textContent = `${rows.length} 个导出`;

  // ---- 分组筛选 ----
  // 分组顺序取自 api-meta.js，只保留当前确实有条目的分组
  const groups = groupOrder([...new Set(rows.map((r) => r.group))]);
  const active = new Set();

  // 支持从首页带 ?group=几何 直达某个分组
  const wanted = new URLSearchParams(location.search).get("group");
  if (wanted && groups.includes(wanted)) active.add(wanted);

  /** 详情面板：函数给签名，类给构造/默认选项/方法，常量给实际值 */
  function buildDetail(r) {
    const d = describe(r.name, uiik[r.name], r.kind);
    const box = el("div", { class: "api-detail" });

    if (d.signature) {
      box.append(el("code", { class: "api-sig", text: d.signature }));
    }
    if (d.value !== undefined) {
      box.append(el("code", { class: "api-sig api-sig--value", text: r.name + " = " + d.value }));
    }

    if (d.base) {
      box.append(el("p", { class: "api-note", text: "继承自 " + d.base }));
    }

    if (d.options && d.options.length) {
      box.append(el("h4", { class: "api-detail__h", text: "默认选项" }));
      const ul = el("ul", { class: "api-opts" });
      for (const [k, v] of d.options) {
        ul.append(
          el("li", {}, [el("code", { text: k }), el("span", { class: "api-opts__v", text: "= " + v })])
        );
      }
      box.append(ul);
    }

    if (d.members && d.members.length) {
      box.append(el("h4", { class: "api-detail__h", text: "方法与属性" }));
      const ul = el("ul", { class: "api-members" });
      for (const mem of d.members) {
        ul.append(
          el("li", { class: mem.own ? "" : "is-inherited" }, [
            el("code", { text: mem.sig }),
            el("span", { class: "api-members__from", text: mem.own ? "" : "继承 " + mem.from }),
          ])
        );
      }
      box.append(ul);
    }

    box.append(
      el("p", { class: "api-note", text: "构建产物已剥离类型标注，完整类型见 src/ 对应源码。" })
    );
    return box;
  }

  /** 同一时间只展开一个，避免多张卡片同时撑高 */
  let opened = null;

  function buildItem(r) {
    const li = el("li", { class: "api-item", tabindex: "0", role: "button" });
    li.setAttribute("aria-expanded", "false");

    const head = el("div", { class: "api-item__head" });
    const code = el("code", { class: "api-item__name", text: r.name });
    const copyBtn = el("button", {
      class: "btn btn--sm btn--ghost api-item__copy",
      type: "button",
      text: "复制",
      title: "复制 " + r.name,
    });
    copyBtn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const ok = await copy(r.name);
      copyBtn.textContent = ok ? "已复制" : "复制失败";
      copyBtn.classList.toggle("is-ok", ok);
      setTimeout(() => {
        copyBtn.textContent = "复制";
        copyBtn.classList.remove("is-ok");
      }, 1500);
    });

    head.append(code, el("span", { class: "api-kind", text: r.kind }));
    if (r.arity != null && r.kind === "fn") {
      head.append(el("span", { class: "api-arity", text: "arity " + r.arity }));
    }
    head.append(copyBtn, el("span", { class: "api-item__caret", text: "▾" }));

    li.append(head, el("p", { class: "api-item__desc", text: r.desc }));

    let detail = null;
    const setOpen = (open) => {
      li.classList.toggle("is-open", open);
      li.setAttribute("aria-expanded", String(open));
      // 详情按需构建，避免一次性为 70 个导出全部解析
      if (open && !detail) {
        detail = buildDetail(r);
        li.append(detail);
      }
    };
    const toggle = () => {
      const next = !li.classList.contains("is-open");
      if (next && opened && opened !== li && opened.isConnected) {
        opened.dispatchEvent(new Event("api:close"));
      }
      setOpen(next);
      opened = next ? li : null;
    };
    li.addEventListener("api:close", () => setOpen(false));
    li.addEventListener("click", toggle);
    li.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        toggle();
      }
    });

    return li;
  }

  const chip = (label, value) => {
    const b = el("button", { class: "chipbtn", text: label, type: "button" });
    b.addEventListener("click", () => {
      if (value == null) {
        active.clear();
      } else if (active.has(value)) {
        active.delete(value);
      } else {
        active.add(value);
      }
      render();
    });
    return b;
  };

  const chipActive = (b, on) => b.classList.toggle("is-on", on);

  function renderChips() {
    groupBar.replaceChildren();
    const all = chip("全部", null);
    groupBar.append(all);
    chipActive(all, active.size === 0);
    groups.forEach((g) => {
      const n = rows.filter((r) => r.group === g).length;
      if (!n) return;
      const b = chip(`${g} ${n}`, g);
      groupBar.append(b);
      chipActive(b, active.has(g));
    });
  }

  function render() {
    const kw = searchEl.value.trim().toLowerCase();
    const hit = rows.filter((r) => {
      if (active.size && !active.has(r.group)) return false;
      if (!kw) return true;
      return (
        r.name.toLowerCase().includes(kw) ||
        r.desc.toLowerCase().includes(kw) ||
        r.group.toLowerCase().includes(kw)
      );
    });

    renderChips();
    document.getElementById("api-shown").textContent = `${hit.length} / ${rows.length}`;

    const frag = document.createDocumentFragment();
    // 按分组聚合，组内保持字母序
    const byGroup = new Map();
    for (const r of hit) {
      if (!byGroup.has(r.group)) byGroup.set(r.group, []);
      byGroup.get(r.group).push(r);
    }
    const order = [...groups, ...byGroup.keys()].filter(
      (g, i, a) => a.indexOf(g) === i && byGroup.has(g)
    );

    for (const g of order) {
      const box = el("section", { class: "api-group2" });
      box.append(el("h2", { class: "api-group2__title", text: `${g} (${byGroup.get(g).length})` }));
      const ul = el("ul", { class: "api-items" });
      for (const r of byGroup.get(g)) {
        ul.append(buildItem(r));
      }
      box.append(ul);
      frag.append(box);
    }
    listEl.replaceChildren(frag);
    opened = null; // 列表重建后旧的展开节点已脱离文档
  }

  searchEl.addEventListener("input", render);
  document.getElementById("api-reset").addEventListener("click", () => {
    searchEl.value = "";
    active.clear();
    render();
    searchEl.focus();
  });
  if (!active.size) searchEl.focus();
  render();
})();
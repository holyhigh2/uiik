/**
 * uiik demo runtime
 * 极简的 demo 组装器：负责卡片骨架、导航、示例代码面板、主题与滚动高亮。
 * 不依赖任何第三方库，两个示例页共用。
 */

const sections = [];
let navHost = null;
let mainHost = null;

/* ------------------------------ dom helpers ------------------------------ */

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "class") node.className = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "text") node.textContent = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== undefined && value !== null) {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** 将值序列化为日志友好的字符串，DOM 节点输出为可读描述 */
export function fmt(value, depth = 0) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const t = typeof value;
  if (t === "number" || t === "boolean") return String(value);
  if (t === "string") return depth ? `"${value}"` : value;
  if (t === "function") return `ƒ ${value.name || "anonymous"}()`;
  if (value instanceof Element) {
    const cls = (value.getAttribute("class") || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("");
    return `<${value.tagName.toLowerCase()}${value.id ? "#" + value.id : ""}${cls}>`;
  }
  if (Array.isArray(value)) {
    if (depth > 2) return `[${value.length} items]`;
    return `[${value.map((v) => fmt(v, depth + 1)).join(", ")}]`;
  }
  if (t === "object") {
    const keys = Object.keys(value);
    if (depth > 2) return `{${keys.length} keys}`;
    return `{ ${keys
      .map((k) => `${k}: ${fmt(value[k], depth + 1)}`)
      .join(", ")} }`;
  }
  return String(value);
}

/* -------------------------------- code -------------------------------- */

/** 复制文本：优先用 Clipboard API，非安全上下文降级到 execCommand */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* 继续走降级方案 */
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

/**
 * 由 cfg 生成一份可复制的代码骨架，
 * demo 未提供 code 时作为兜底，保证面板不为空
 */
function skeleton(cfg) {
  const sig = cfg.api || "";
  const fn = sig.match(/^(\w+)/)?.[1] || "";
  const optKeys =
    (sig.match(/\{([^}]*)\}/)?.[1] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const lines = [];
  if (fn) lines.push(`import { ${fn} } from "uiik";`, "");
  const optStr = (cfg.options || []).map((o) => {
    const i = o.indexOf("=");
    return i < 0 ? o : `${o.slice(0, i)}: ${o.slice(i + 1)}`;
  });
  const body = optStr.length ? `, {\n  ${optStr.join(",\n  ")}\n}` : "";
  lines.push(`// ${cfg.title}`);
  if (fn) lines.push(`${fn}("#selector"${body});`);
  return lines.join("\n");
}

/**
 * 创建「示例代码」面板：可复制，内容可随交互实时更新
 * @param {HTMLElement} host
 * @param {string} initial
 * @returns {(code: string) => void} 设置代码内容
 */
export function createCode(host, initial = "") {
  const pre = el("pre", { class: "code__pre" });
  const btn = el("button", {
    class: "btn btn--sm btn--ghost",
    type: "button",
    text: "复制",
    title: "复制示例代码",
  });
  const head = el("div", { class: "code__head" }, [el("h4", { text: "示例代码" }), btn]);
  const wrap = el("div", { class: "code" }, [head, pre]);
  host.append(wrap);

  let current = "";
  const set = (code) => {
    current = code || "";
    pre.textContent = current;
  };
  set(initial);

  let timer = 0;
  btn.addEventListener("click", async () => {
    const ok = await copyText(current);
    btn.textContent = ok ? "已复制" : "复制失败";
    btn.classList.toggle("is-ok", ok);
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.textContent = "复制";
      btn.classList.remove("is-ok");
    }, 1600);
  });

  return set;
}

/* -------------------------------- section -------------------------------- */

/**
 * 声明一个 demo 卡片
 * @param {object} cfg
 * @param {string} cfg.id      锚点 id（不含前缀）
 * @param {string} cfg.group   侧栏分组名
 * @param {string} cfg.api     函数签名
 * @param {string} cfg.title   卡片标题
 * @param {string} [cfg.desc]  说明
 * @param {string[]} [cfg.options] 用到的选项
 * @param {string[]} [cfg.tags] 标签
 * @param {string} [cfg.html]  舞台 HTML
 * @param {string} [cfg.code]  示例代码；缺省由 api/options 生成骨架
 * @param {boolean} [cfg.noAside] 不渲染右侧面板
 */
export function section(cfg) {
  const head = el("div", { class: "card__head" }, [
    el("div", { class: "card__top" }, [
      el("h2", { class: "card__title", text: cfg.title }),
      el("code", { class: "sig", text: cfg.api }),
      ...(cfg.tags || []).map((t) => el("span", { class: `tag tag--${t}`, text: t.toUpperCase() })),
    ]),
    cfg.desc ? el("p", { class: "card__desc", html: cfg.desc }) : null,
    cfg.options && cfg.options.length
      ? el(
          "ul",
          { class: "chips" },
          cfg.options.map((o) => {
            const [k, v] = o.split("=");
            return el("li", { class: "chip" }, [
              el("b", { text: k }),
              v ? " = " + v : "",
            ]);
          })
        )
      : null,
  ]);

  const stage = el("div", { class: "card__stage" });
  const stageHost = el("div", {
    class: "stage stage--tall stage--grid-bg",
    html: cfg.html || "",
  });
  stage.append(stageHost);

  const body = el("div", { class: "card__body" }, [stage]);

  const controls = el("div", { class: "aside__block" });
  const codeHost = el("div", { class: "aside__block" });
  let setCode = () => {};
  if (!cfg.noAside) {
    body.append(el("div", { class: "card__aside" }, [controls, codeHost]));
  } else {
    body.style.gridTemplateColumns = "minmax(0, 1fr)";
  }
  setCode = createCode(codeHost, cfg.code || skeleton(cfg));

  const root = el("section", { class: "card", id: `demo-${cfg.id}` }, [head, body]);
  sections.push({ cfg, root });
  // 立即挂载，保证调用方可以直接用选择器 / getElementById 找到舞台元素
  (mainHost || document.querySelector("#main"))?.append(root);
  return {
    root,
    stage,
    stageHost,
    controls,
    code: setCode,
    // noAside 的示例可把代码面板塞进自己的面板容器
    codeHost,
  };
}

/* --------------------------------- mount --------------------------------- */

/**
 * 生成侧栏导航并启用滚动高亮、主题切换
 * @param {{nav: string, main: string}} hosts
 */
export function mount(hosts, pageMeta = {}) {
  navHost = document.querySelector(hosts.nav);
  mainHost = document.querySelector(hosts.main);

  const groups = [];
  for (const { cfg, root } of sections) {
    if (root.parentNode !== mainHost) mainHost?.append(root);
    // 清理未被使用的空面板
    root.querySelectorAll(".card__aside > .aside__block:empty").forEach((n) => n.remove());
    const aside = root.querySelector(".card__aside");
    if (aside && aside.childElementCount === 0) aside.remove();
    let group = groups.find((g) => g.name === cfg.group);
    if (!group) {
      group = { name: cfg.group, items: [] };
      groups.push(group);
    }
    group.items.push(cfg);
  }

  navHost.append(
    el("div", { class: "sidenav__title", text: pageMeta.navTitle || "APIs" })
  );
  for (const group of groups) {
    navHost.append(
      el("div", { class: "sidenav__group" }, [
        el("div", { class: "sidenav__label", text: group.name }),
        ...group.items.map((cfg) =>
          el("a", { href: `#demo-${cfg.id}`, text: cfg.nav || cfg.title })
        ),
      ])
    );
  }

  setupScrollSpy();
  setupTheme();
  return { count: sections.length };
}

/* ------------------------------ scroll spy ------------------------------- */

function setupScrollSpy() {
  const links = new Map();
  navHost.querySelectorAll("a").forEach((a) => {
    links.set(a.getAttribute("href").slice(1), a);
  });

  let raf = 0;
  const update = () => {
    raf = 0;
    // 以视口相对位置判定当前卡片，避免受 offsetParent 影响
    const line = 100;
    let current = "";
    for (const { root } of sections) {
      if (root.getBoundingClientRect().top <= line) current = root.id;
    }
    links.forEach((a, id) => a.classList.toggle("is-active", id === current));
    const active = links.get(current);
    if (active) {
      const box = navHost.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      if (item.top < box.top || item.bottom > box.bottom) {
        navHost.scrollTop += item.top - box.top - box.height / 3;
      }
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
}

/* --------------------------------- theme --------------------------------- */

export function setupTheme() {
  const saved = localStorage.getItem("uiik-theme");
  if (saved) document.documentElement.dataset.theme = saved;

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const sync = () => {
      const dark = document.documentElement.dataset.theme !== "light";
      btn.textContent = dark ? "☾ dark" : "☀ light";
      btn.title = "切换主题";
    };
    btn.addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme !== "light";
      document.documentElement.dataset.theme = dark ? "light" : "dark";
      localStorage.setItem("uiik-theme", dark ? "light" : "dark");
      sync();
    });
    sync();
  });
}

/* ------------------------------ tiny widgets ----------------------------- */

/** 创建一个带 label 的滑杆，返回 { input, set } */
export function slider(parent, label, { min, max, step = 1, value, onInput }) {
  const out = el("b", { text: String(value) });
  const input = el("input", {
    type: "range",
    min,
    max,
    step,
    value,
  });
  input.addEventListener("input", () => {
    out.textContent = input.value;
    onInput(Number(input.value));
  });
  parent.append(el("label", { class: "field" }, [label, input, out]));
  return {
    input,
    set(v) {
      input.value = v;
      out.textContent = String(v);
      onInput(Number(v));
    },
  };
}

/** 下拉选择 */
export function select(parent, label, { value, options, onChange }) {
  const sel = el(
    "select",
    {},
    options.map((o) => el("option", { value: o, text: o }))
  );
  sel.value = value;
  sel.addEventListener("change", () => onChange(sel.value));
  parent.append(el("label", { class: "field" }, [label, sel]));
  return sel;
}

/** 按钮组 */
export function buttons(parent, defs) {
  const row = el("div", { class: "btn-row" });
  const map = {};
  for (const def of defs) {
    const [label, fn, cls] = Array.isArray(def) ? def : [def, () => {}, ""];
    const btn = el("button", {
      class: `btn btn--sm ${cls || ""}`.trim(),
      text: label,
    });
    btn.addEventListener("click", fn);
    map[label] = btn;
    row.append(btn);
  }
  parent.append(row);
  return { row, ...map };
}

/** 读数面板：setter 形式更新 <pre class="readout">（用文本节点渲染，避免被当成 HTML） */
export function readout(host, title = "readout") {
  const pre = el("pre", { class: "readout" });
  const block = el("div", { class: "aside__block" }, [
    el("h4", { text: title }),
    pre,
  ]);
  host.append(block);
  return (rows) => {
    const nodes = [];
    for (const row of Array.isArray(rows) ? rows : [rows]) {
      if (Array.isArray(row)) {
        const line = el("span");
        line.append(el("b", { text: String(row[0]) }), "  " + String(row[1]));
        nodes.push(line);
      } else {
        nodes.push(document.createTextNode(String(row)));
      }
      nodes.push(document.createTextNode("\n"));
    }
    pre.replaceChildren(...nodes);
  };
}

/**
 * grid 设置入口：两个滑杆分别控制 X / Y 网格步长。
 * 两轴相等时传数字，否则传 [x, y]；都为 0 表示关闭网格吸附（grid: undefined）。
 * @param {HTMLElement} parent
 * @param {import("./uiik.js").Draggable} inst
 */
export function gridSliders(
  parent,
  inst,
  { min = 0, max = 48, step = 2, x = 10, y = 10, onChange } = {}
) {
  const box = el("div", { class: "aside__block" }, [
    el("h4", { text: "grid 网格吸附" }),
  ]);
  parent.append(box);

  const apply = (gx, gy) => {
    const grid = gx === gy ? gx : [gx, gy];
    inst.setOptions({ grid: grid === 0 ? undefined : grid });
    const cur = inst.getOption("grid");
    onChange?.(cur === undefined ? "off" : Array.isArray(cur) ? cur : `${cur} (x=y)`);
  };

  const sx = slider(box, "gridX", {
    min,
    max,
    step,
    value: x,
    onInput: (v) => apply(v, Number(sy.input.value)),
  });
  const sy = slider(box, "gridY", {
    min,
    max,
    step,
    value: y,
    onInput: (v) => apply(Number(sx.input.value), v),
  });

  buttons(box, [["关闭", () => {
    sx.set(0);
    sy.set(0);
  }, "btn--ghost"]]);
  box.append(
    el("p", {
      class: "field",
      style: "display:block;margin:8px 0 0;line-height:1.5",
      text: "0 = 关闭网格；两轴相等时传数字，否则传 [x, y]。" +
        "注意库先做网格吸附再做 containment 边界裁剪，被边界夹住时落点可能不是网格倍数。",
    })
  );
  return { sx, sy };
}

/** 8 个缩放手柄（DOM）。scope 为附加的类名，便于用选择器精确定位 */
export function domHandles(scope = "") {
  const p = scope ? scope + " " : "";
  return `
    <div class="${p}uii-resizable-handle-nw" style="left:-5px;top:-5px"></div>
    <div class="${p}uii-resizable-handle-n"  style="left:50%;top:-5px;margin-left:-5px"></div>
    <div class="${p}uii-resizable-handle-ne" style="right:-5px;top:-5px"></div>
    <div class="${p}uii-resizable-handle-e"  style="right:-5px;top:50%;margin-top:-5px"></div>
    <div class="${p}uii-resizable-handle-se" style="right:-5px;bottom:-5px"></div>
    <div class="${p}uii-resizable-handle-s"  style="left:50%;bottom:-5px;margin-left:-5px"></div>
    <div class="${p}uii-resizable-handle-sw" style="left:-5px;bottom:-5px"></div>
    <div class="${p}uii-resizable-handle-w"  style="left:-5px;top:50%;margin-top:-5px"></div>`;
}

/**
 * 8 个缩放手柄（SVG rect）
 * 与 DOM 版不同，SVG 手柄是独立的图元，不会像 CSS 那样自动跟随目标，
 * 因此需要按目标当前的 x/y/width/height 摆放，并用 syncSvgHandles 在缩放时同步。
 * @param x 目标左上角 x
 * @param y 目标左上角 y
 * @param w 目标宽度
 * @param h 目标高度
 * @param r 手柄半径
 */
export function svgHandles(x, y, w, h, r = 5) {
  const mx = x + w / 2;
  const my = y + h / 2;
  const pos = [
    ["nw", x, y],
    ["n", mx, y],
    ["ne", x + w, y],
    ["e", x + w, my],
    ["se", x + w, y + h],
    ["s", mx, y + h],
    ["sw", x, y + h],
    ["w", x, my],
  ];
  return pos
    .map(
      ([dir, cx, cy]) =>
        `<rect class="uii-resizable-handle-${dir}" x="${cx - r}" y="${
          cy - r
        }" width="${r * 2}" height="${r * 2}" rx="1.5" fill="rgba(251,191,36,.75)"></rect>`
    )
    .join("");
}

/** 把手柄移动到目标当前的八向顶点上（SVG 手柄不会自动跟随目标） */
export function syncSvgHandles(handles, x, y, w, h, r = 5) {
  const mx = x + w / 2;
  const my = y + h / 2;
  const pos = {
    nw: [x, y],
    n: [mx, y],
    ne: [x + w, y],
    e: [x + w, my],
    se: [x + w, y + h],
    s: [mx, y + h],
    sw: [x, y + h],
    w: [x, my],
  };
  handles.forEach((h) => {
    const dir = (h.getAttribute("class").match(EXP_HANDLE_DIR) || [])[1];
    const p = dir && pos[dir];
    if (!p) return;
    h.setAttribute("x", p[0] - r);
    h.setAttribute("y", p[1] - r);
  });
}

const EXP_HANDLE_DIR = /uii-resizable-handle-(\w+)/;

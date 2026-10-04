/**
 * 从运行时导出值里解析出可读的细节，供 API 页点击展开。
 *
 * 构建产物里 JSDoc 与类型标注已被剥掉，但形参名、默认值、构造函数的
 * 默认选项对象都还在，所以签名可以如实还原；类型信息只能指向源码。
 * 类字段（onStart / onDrag 这类箭头函数字段）会被 esbuild 擦除，
 * 因此类详情只列原型链上的方法，不去猜实例字段。
 */

/** 按顶层分隔符切分，跳过括号内的分隔符 */
function splitTop(s, sep) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/** 顶层分隔符的位置 */
function indexOfTop(s, ch) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === ch && depth === 0) return i;
  }
  return -1;
}

/** 取出匹配的右括号位置 */
function matchParen(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") {
      depth--;
      if (!depth) return i;
    }
  }
  return -1;
}

/** 源码里第一个顶层 { 之前的部分，即函数头 */
function headerOf(src) {
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "{" || ch === "}") {
      if (depth === 0) return src.slice(0, i);
      depth--;
    }
  }
  return src.split("\n")[0];
}

/** 形参列表文本，保留默认值 */
export function paramsOf(src) {
  const h = headerOf(src);
  const open = h.indexOf("(");
  if (open < 0) return "";
  const end = matchParen(h, open);
  const inner = end < 0 ? h.slice(open + 1) : h.slice(open + 1, end);
  return splitTop(inner, ",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

/** name(a, b = true) */
export function signature(name, fn) {
  return name + "(" + paramsOf(String(fn)) + ")";
}

/** 构造函数的形参 */
export function ctorParams(cls) {
  const src = String(cls);
  const at = src.indexOf("constructor");
  if (at < 0) return "";
  const open = src.indexOf("(", at);
  if (open < 0) return "";
  const end = matchParen(src, open);
  const inner = end < 0 ? src.slice(open + 1) : src.slice(open + 1, end);
  return splitTop(inner, ",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

/**
 * 默认选项：只在 super(...) 的实参里找第一个对象字面量，
 * 避免误取构造函数体后面的花括号
 */
export function defaultOptions(cls) {
  const src = String(cls);
  const sup = src.indexOf("super(");
  if (sup < 0) return [];
  const open = matchParen(src, sup + "super".length);
  const args = src.slice(sup + 6, open < 0 ? src.length : open);
  const ob = args.indexOf("{");
  if (ob < 0) return [];

  let depth = 0;
  let end = -1;
  for (let i = ob; i < args.length; i++) {
    if (args[i] === "{") depth++;
    else if (args[i] === "}") {
      depth--;
      if (!depth) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return [];

  return splitTop(args.slice(ob + 1, end), ",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const c = indexOfTop(entry, ":");
      return c < 0 ? [entry, ""] : [entry.slice(0, c).trim(), entry.slice(c + 1).trim()];
    })
    .filter(([k]) => k);
}

/** 沿原型链收集方法，标出是否继承而来 */
export function classMembers(cls) {
  const out = [];
  const seen = new Set();
  let C = cls;
  let level = 0;
  while (C && C.prototype) {
    for (const k of Object.getOwnPropertyNames(C.prototype)) {
      if (k === "constructor" || k.startsWith("_") || seen.has(k)) continue;
      const d = Object.getOwnPropertyDescriptor(C.prototype, k);
      if (!d || typeof d.value !== "function") continue;
      seen.add(k);
      out.push({
        name: k,
        sig: signature(k, d.value),
        own: level === 0,
        from: level === 0 ? cls.name : C.name || "基类",
      });
    }
    C = Object.getPrototypeOf(C);
    level++;
  }
  return out;
}

/** 基类名，无继承则返回 null */
export function baseClass(cls) {
  const C = Object.getPrototypeOf(cls);
  return C && C.prototype && C.name ? C.name : null;
}

/** 常量值的可读形式 */
export function literal(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === null) return "null";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
}

/**
 * 汇总一个导出值的详情
 * @returns {{signature?: string, options?: Array, members?: Array, base?: string, value?: string}}
 */
export function describe(name, value, kind) {
  if (kind === "class") {
    const members = classMembers(value);
    return {
      signature: "new " + name + "(" + ctorParams(value) + ")",
      options: defaultOptions(value),
      members,
      base: baseClass(value),
    };
  }
  if (kind === "fn") {
    return { signature: name + "(" + paramsOf(String(value)) + ")" };
  }
  return { value: literal(value) };
}
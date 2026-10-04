/**
 * API 元数据（首页与 API 查询页共用一份）
 *
 * 列表本身始终来自模块的真实导出，这里只提供「分组 + 一句话说明」。
 * 元数据是手工维护的，因此 buildApiRows 会同时报出：
 * - missing：真实导出里没有元数据的条目
 * - stale：元数据里已经不存在的条目
 * 两者都会在控制台告警，避免像曾经的手写清单那样悄悄漂移。
 */

/** 分组元数据：name -> [分组, 说明] */
export const META = {
  // ---- 交互类工厂 ----
  newDraggable: ["交互", "创建可拖动元素，支持 ghost / snap / group / scroll 等"],
  newDroppable: ["交互", "创建投放目标，用 accepts 过滤可接收的 draggable"],
  newResizable: ["交互", "创建可缩放元素，八向手柄，支持 min/max 与 ghost 预览"],
  newRotatable: ["交互", "创建可旋转元素，handle 指定旋转手柄"],
  newSplittable: ["交互", "把容器拆成可拖动分隔的面板"],
  newSelectable: ["交互", "框选容器内的目标，支持 overlap / inclusion"],
  newSortable: ["交互", "列表拖拽排序，支持跨容器搬运与 ghost"],
  newCollisionDetector: ["交互", "纯几何碰撞查询：getOverlaps / getInclusions / update"],

  // ---- 类 ----
  Uii: ["类", "所有交互实例的基类，封装事件绑定与实例注册"],
  Draggable: ["类", "Draggable 实例类，通常不直接 new"],
  Droppable: ["类", "Droppable 实例类"],
  Resizable: ["类", "Resizable 实例类"],
  Rotatable: ["类", "Rotatable 实例类"],
  Splittable: ["类", "Splittable 实例类"],
  Selectable: ["类", "Selectable 实例类"],
  Sortable: ["类", "Sortable 实例类"],
  CollisionDetector: ["类", "CollisionDetector 实例类"],
  UiiTransform: ["类", "wrapper() 返回的实例，统一 HTML/SVG 的位移与旋转"],

  // ---- 几何 ----
  getRectRight: ["几何", "矩形右边界 x + w"],
  getRectBottom: ["几何", "矩形下边界 y + h"],
  rectCenter: ["几何", "矩形中心点 {x, y}"],
  rectsOverlap: ["几何", "两矩形是否相交"],
  rectContains: ["几何", "a 是否完全包含 b"],
  rectInset: ["几何", "按四边内缩矩形"],
  unionRect: ["几何", "一组矩形的并集（整体包围盒）"],
  alignRects: ["几何", "按 left/centerX/right/top/centerY/bottom 对齐一组矩形"],
  distributeRects: ["几何", "沿单轴等间距分布，支持 gap 与另一轴对齐"],
  resizeRect: ["几何", "八向缩放求解：dir 指拖动哪侧手柄，对侧不动"],
  snapToGrid: ["几何", "四舍五入吸附到网格步长，负坐标同样正确"],
  findSnap: ["几何", "求候选矩形对一组目标的吸附位移 dx / dy"],
  snapGuides: ["几何", "由吸附结果生成参考线（横线配 x、竖线配 y）"],
  fitRectInViewport: ["几何", "把内容缩放并居中到视口，返回 View"],
  zoomAt: ["几何", "以指针为锚点缩放，锚点下的世界坐标保持不动"],
  panBy: ["几何", "平移视图 View"],

  // ---- 变换 ----
  wrapper: ["变换", "返回 UiiTransform 实例，屏蔽 HTML/SVG 的 transform 差异"],
  moveTo: ["变换", "函数式位移到指定坐标"],
  transformMoveTo: ["变换", "仅写入 transform 的位移实现"],
  moveBy: ["变换", "按增量位移"],
  rotateTo: ["变换", "旋转到指定角度"],
  getTranslate: ["变换", "只读当前 transform 中的位移 {x, y}"],

  // ---- 测量与工具 ----
  getBox: ["测量", "元素相对页面的矩形"],
  getPointInContainer: ["测量", "把鼠标点换算到容器坐标系（已扣除边框与滚动）"],
  getPointOffset: ["测量", "把 offsetX/offsetY 换算为相对容器的位移"],
  getRectInContainer: ["测量", "元素在容器坐标系中的矩形，已换算缩放"],
  getRectCenter: ["测量", "元素矩形中心点"],
  getCenterXy: ["测量", "HTML 元素中心，ox/oy 可为百分比或 0~1"],
  getCenterXySVG: ["测量", "SVG 图元中心，能正确处理旋转与嵌套"],
  getVertex: ["测量", "按百分比取元素锚点，如 getVertex(el, '50%', '50%')"],
  calcVertex: ["测量", "按绝对坐标 + 角度计算旋转后的锚点"],
  parseOxy: ["测量", "把百分比或数字解析为坐标偏移"],
  normalizeVector: ["测量", "向量归一化"],
  getStyleXy: ["测量", "样式里的 left / top 数值"],
  getStyleSize: ["测量", "样式宽高，返回数值而非字符串"],
  getMatrixInfo: ["测量", "解析 transform 得 {scale, angle, x, y}；recur 递归祖先"],
  isSVGEl: ["测量", "判断是否为 SVG 元素"],
  isVisible: ["测量", "按尺寸判断是否可见"],
  getScrollParent: ["测量", "查找真正可滚动的祖先；找不到返回 null，不回退 document"],
  getScrollViewportRect: ["测量", "可滚动视口的 padding box 矩形（已排除边框与滚动条）"],
  lockPage: ["测量", "锁定页面滚动"],
  unlockPage: ["测量", "解除页面滚动锁定"],
  saveCursor: ["测量", "保存当前光标样式"],
  setCursor: ["测量", "设置光标样式"],
  restoreCursor: ["测量", "恢复 saveCursor 保存的光标"],

  // ---- 常量 ----
  ONE_ANG: ["常量", "1 角度 = π/180"],
  ONE_RAD: ["常量", "1 弧度对应的角度"],
  THRESHOLD: ["常量", "判定为拖动所需的最小位移（px）"],
  EDGE_THRESHOLD: ["常量", "边缘自动滚动的触发距离（px）"],
  DRAGGING_RULE: ["常量", "拖动时锁定的 CSS 规则"],
  UII_KEY: ["常量", "实例挂在 DOM 上的标识键"],
  VERSION: ["常量", "当前版本号"],
};

export const GROUP_ORDER = ["交互", "类", "几何", "变换", "测量", "常量"];

/** 没有元数据的条目归到这里 */
export const FALLBACK_GROUP = "其他";

/**
 * 从模块命名空间生成 API 行，并顺带做元数据一致性检查
 * @param {object} ns 模块命名空间（通常是 import * as uiik 的结果）
 * @returns {{rows: Array, missing: string[], stale: string[]}}
 */
export function buildApiRows(ns) {
  const names = Object.keys(ns)
    .filter((k) => k !== "default")
    .sort();

  const missing = names.filter((n) => !META[n]);
  const stale = Object.keys(META).filter((n) => !names.includes(n));

  const rows = names.map((name) => {
    const v = ns[name];
    const type = typeof v;
    const isCtor = type === "function" && /^\s*class\s/.test(Function.prototype.toString.call(v));
    let arity = null;
    if (type === "function" && !isCtor) {
      try {
        arity = v.length;
      } catch (e) {
        arity = null;
      }
    }
    const [group, desc] = META[name] || [FALLBACK_GROUP, ""];
    return { name, kind: isCtor ? "class" : type === "function" ? "fn" : type, arity, group, desc };
  });

  return { rows, missing, stale };
}

/** 分组顺序，未知分组排在最后 */
export function groupOrder(groups) {
  return [...GROUP_ORDER.filter((g) => groups.includes(g)), ...groups.filter((g) => !GROUP_ORDER.includes(g))];
}
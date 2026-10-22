/* eslint-disable max-len */
/**
 * 指针式拖拽会话（纯指针事件，非 HTML5 DnD）
 *
 * 把「按下—移动—松开」的常见交互骨架收敛成一次受控会话，内置三件事：
 *
 * 1. **起拖阈值**：位移未达 {@link PointerDragOptions.threshold} 即松开视为点击，
 *    放行给业务自己的 click 逻辑；越过阈值才进入拖拽。阈值前的每次移动经
 *    {@link PointerDragOptions.onPreMove} 透出，供调用方 preventDefault。
 * 2. **缓存矩形命中**：进入拖拽时调用一次 {@link PointerDragOptions.targets}
 *    收集候选目标的矩形并缓存，之后用「点在矩形内」判定落点。
 *    这是为了绕开 `document.elementFromPoint` 对嵌套 open shadow 不穿透的问题
 *    —— 它只会返回最外层宿主，而真实鼠标事件的命中测试是正常的。拖拽期间只更新
 *    位置不改变布局时，起手缓存即安全。
 * 3. **异常中断清理**：指针离开视口（documentElement 的 mouseleave）、窗口失焦
 *    （blur）、或拖拽中 `mousemove` 的 `e.buttons === 0`（mouseup 在窗口外丢失）
 *    都会取消会话，避免 ghost/高亮/监听器泄漏。
 *
 * 起手时若还有上一次未清理的会话，会先将其取消（异常残留的双保险）。
 *
 * @author holyhigh2
 * @see rectContainsPoint
 */

import type { Rect } from "./geometry";
import { rectContainsPoint } from "./geometry";

/** 拖拽命中目标：矩形 + 业务数据（data 为命中时回调返回给调用方的内容） */
export interface DragTarget<T> {
  rect: Rect;
  data: T;
}

export interface PointerDragOptions<T> {
  /** 触发会话的起手 mousedown 事件 */
  ev: MouseEvent;
  /**
   * 进入拖拽时调用一次，返回候选目标（矩形会被缓存）。
   * 缺省为无目标 —— 仅需要一个阈值化的拖拽骨架时可不传。
   */
  targets?: () => DragTarget<T>[];
  /** 起拖阈值（px），缺省 5 */
  threshold?: number;
  /** 越过阈值进入拖拽时回调，适合在这里创建 ghost */
  onStart?: (ev: MouseEvent) => void;
  /** 拖拽中指针移动；hit 为当前命中的目标 data，未命中为 null */
  onMove?: (hit: T | null, ev: MouseEvent) => void;
  /** 阈值前每次移动（按钮未松开）时回调，可在此 preventDefault 阻止选中/滚动 */
  onPreMove?: (ev: MouseEvent) => void;
  /** 拖拽中松开鼠标的落位回调；hit 为落点目标 data，未命中为 null */
  onDrop?: (hit: T | null, ev: MouseEvent) => void;
  /** 位移未达阈值即松开（视为点击） */
  onClick?: (ev: MouseEvent) => void;
  /** 异常中断（离开视口/失焦/按钮丢失/新会话抢占）时回调；ev 为触发中断的事件 */
  onCancel?: (ev?: Event) => void;
  /** 会话结束（无论正常落位还是中断）的总清理：移除 ghost/高亮等。仅当已进入拖拽时调用 */
  onEnd?: () => void;
}

/** 当前活跃会话的清理函数；新会话起手先调用，防止上一次异常残留 */
let activeCleanup: (() => void) | null = null;

/** 由元素取包围盒，便于构建 {@link DragTarget}（jsdom 无布局，返回全 0） */
export function elementRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/**
 * 开始一次指针拖拽会话。
 *
 * @param opts 会话配置（含起手的 mousedown 事件与各阶段回调）
 * @returns 清理函数，调用即取消会话
 */
export function beginPointerDrag<T>(opts: PointerDragOptions<T>): () => void {
  // 双保险：上一次会话若因 mouseup 丢失而残留，先彻底结束它（含 onCancel/onEnd）
  activeCleanup?.();
  activeCleanup = null;

  const startX = opts.ev.clientX;
  const startY = opts.ev.clientY;
  const threshold = opts.threshold != null ? opts.threshold : 5;
  let dragging = false;
  let finished = false;
  let cache: DragTarget<T>[] = [];

  const removeListeners = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    document.documentElement.removeEventListener("mouseleave", abort);
    window.removeEventListener("blur", abort);
  };

  /** 幂等收尾：移除监听、清空缓存。返回本次是否真正由自己完成收尾 */
  const finish = (): boolean => {
    if (finished) return false;
    finished = true;
    removeListeners();
    cache = [];
    if (activeCleanup === abort) activeCleanup = null;
    return true;
  };

  /**
   * 异常中断：离开视口/失焦/按钮丢失，或新会话抢占
   * @param ev 触发中断的事件；主动取消/抢占时无事件
   */
  function abort(ev?: Event) {
    if (!finish()) return;
    if (dragging) {
      opts.onCancel?.(ev);
      opts.onEnd?.();
    }
  }

  const hitAt = (x: number, y: number): T | null => {
    for (const t of cache) {
      if (rectContainsPoint(t.rect, x, y)) return t.data;
    }
    return null;
  };

  function move(e: MouseEvent) {
    if (!dragging) {
      // 阈值前按钮已松开：静默收尾，放行后续 click
      if (e.buttons === 0) {
        finish();
        return;
      }
      //严格大于阈值才起拖，与既有交互实现的判定保持一致
      if (Math.hypot(e.clientX - startX, e.clientY - startY) <= threshold) {
        opts.onPreMove?.(e);
        return;
      }
      dragging = true;
      cache = opts.targets ? opts.targets() : [];
      opts.onStart?.(e);
    } else if (e.buttons === 0) {
      // 拖拽中按钮归零 = mouseup 在窗口外丢失 → 视为取消
      abort(e);
      return;
    }
    opts.onMove?.(hitAt(e.clientX, e.clientY), e);
  }

  function up(e: MouseEvent) {
    const wasDragging = dragging;
    const hit = wasDragging ? hitAt(e.clientX, e.clientY) : null;
    if (!finish()) return;
    if (!wasDragging) {
      opts.onClick?.(e);
      return;
    }
    // 与既有实现一致：先清理（onEnd）再落位
    opts.onEnd?.();
    opts.onDrop?.(hit, e);
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  document.documentElement.addEventListener("mouseleave", abort);
  window.addEventListener("blur", abort);
  activeCleanup = abort;
  return abort;
}

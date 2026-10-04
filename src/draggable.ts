/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * dom dragger
 * @author holyhigh2
 */
import { assign, closest, compact, each, get, includes, isArray, isArrayLike, isBoolean, isCustomElement, isDefined, isElement, isEmpty, isFunction, isNumber, isString, isUndefined, map, reject, some, split } from "myfx";
import { findSnap, snapToGrid } from "./geometry";
import type { Rect, SnapHit, SnapPoint } from "./geometry"
import { UiiTransform, wrapper } from "./transform";
import { Uii, UII_KEY } from "./types";
import type { DraggableOptions } from "./types"
import {
  EDGE_THRESHOLD,
  getCenterXy,
  getMatrixInfo,
  getPointInContainer,
  getRectInContainer,
  getScrollParent,
  getScrollViewportRect,
  THRESHOLD
} from "./utils";

const DRAGGER_GROUPS: Record<string, Array<HTMLElement>> = {};
const CLASS_DRAGGABLE = "uii-draggable";
const CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
const CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
const CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";

const HANDLE_MAP = new WeakMap();
const OPTION_MAP = new WeakMap();
const BINDED_CONTAINER = new WeakSet()
const WATCH_MAP: Record<string, Draggable> = {};

/**
 * 解析snap的查询根
 * 优先级：snapOptions.container > containment容器 > 首个可拖动元素的父元素 > document
 * 后两级使组件位于shadow dom内时，无需显式配置也能命中同容器内的选择器
 * @param opts
 * @param container containment容器
 * @param fallbackParent 首个可拖动元素的父元素
 */
function resolveSnapRoot(
  opts: Record<string, any>,
  container: HTMLElement | null,
  fallbackParent: Element | null
): Element | Document {
  const c = opts.snapOptions?.container;
  if (isString(c)) {
    const el = document.querySelector(c);
    if (el) return el;
  } else if (isElement(c)) {
    return c;
  }
  return container || fallbackParent || document;
}

/**
 * 解析snap目标，支持选择器/元素/元素数组/返回元素数组的函数。
 * 与draggable.droppable、CollisionDetector.targets 的多态保持一致
 * @param snap
 * @param root 选择器的查询根
 */
function resolveSnapTargets(snap: any, root: Element | Document): Element[] {
  let list: any;
  if (isFunction(snap)) {
    list = snap();
  } else if (isString(snap)) {
    list = root.querySelectorAll(snap);
  } else if (isElement(snap)) {
    list = [snap];
  } else if (isArrayLike(snap)) {
    list = snap;
  } else {
    list = [];
  }
  return reject(list || [], (el: any) => !el);
}

/** 锚点对应的dir字符：起始边l、结束边r、中线c */
const SNAP_DIR_CHAR: Record<SnapPoint, string> = {
  start: "l",
  center: "c",
  end: "r",
};

/**
 * 生成dirH/dirV，如l2l、c2r。保持与旧版边缘配对命名兼容
 * @param hit
 */
function snapDir(hit?: SnapHit): string {
  if (!hit) return "";
  return SNAP_DIR_CHAR[hit.point] + "2" + SNAP_DIR_CHAR[hit.targetPoint];
}
/**
 * 用于表示一个或多个可拖动元素的定义
 * 每个拖动元素可以有独立handle，也可以公用一个handle
 * 可拖动元素拖动时自动剔除left/top/x/y/cx/cy属性，而使用transform:translate替代
 * > 可用CSS接口
 * - .uii-draggable
 * - .uii-draggable-handle
 * - .uii-draggable-active
 * - .uii-draggable-ghost
 * @public
 */
export class Draggable extends Uii {
  private __container: HTMLElement | null = null;

  constructor(
    els: string | HTMLElement | Array<string | HTMLElement> | NodeListOf<Element>,
    opts?: DraggableOptions
  ) {
    super(
      els,
      assign(
        {
          containment: false,
          watch: true,
          threshold: THRESHOLD,
          ghost: false,
          direction: "",
          scroll: false,
          useTransform: true,
          snapOptions: {
            tolerance: 10,
          },
          self: false,
        },
        opts
      )
    );

    if (this.opts.handle) {
      this.__initHandle(this.ele)
    }

    this.onOptionChanged(this.opts);

    //put into group
    if (this.opts.group) {
      if (!DRAGGER_GROUPS[this.opts.group]) {
        DRAGGER_GROUPS[this.opts.group] = [];
      }
      DRAGGER_GROUPS[this.opts.group].push(...this.ele);
    }

    this.__initStyle(this.ele);

    //containment
    if (this.opts.containment) {
      if (isBoolean(this.opts.containment)) {
        this.__container = isEmpty(this.ele) ? null : this.ele[0].parentElement;
      } else if (isString(this.opts.containment)) {
        this.__container = document.querySelector(this.opts.containment);
      } else if (isElement(this.opts.containment)) {
        this.__container = this.opts.containment as HTMLElement;
      }
    }

    if (this.opts.watch && this.eleString) {
      let con;
      if (isString(this.opts.watch)) {
        con = document.querySelector(this.opts.watch);
      } else {
        con = isEmpty(this.ele) ? null : this.ele[0].parentElement;
      }
      let bindTarget = con || document.body
      if (BINDED_CONTAINER.has(bindTarget)) return

      WATCH_MAP[this.eleString] = this
      this.bindEvent(bindTarget);
      BINDED_CONTAINER.add(bindTarget)
    } else {
      each(this.ele, (el) => {
        this.bindEvent(el);
      });
    }
  }

  private __initHandle(ele: HTMLElement[]) {
    each(ele, (el) => {
      if (HANDLE_MAP.has(el)) return
      let h
      if (isString(this.opts.handle)) {
        h = el.querySelector(this.opts.handle);
        if (!h) {
          console.error('No handle found "' + this.opts.handle + '"');
          return false;
        }
      } else if (isElement(this.opts.handle)) {
        h = this.opts.handle
      }

      HANDLE_MAP.set(el, h);
    });
  }
  //初始化样式
  private __initStyle(draggableList: HTMLElement[]) {
    each(draggableList, (el) => {
      if (OPTION_MAP.has(el)) return
      if (isDefined(this.opts.type)) el.dataset.dropType = this.opts.type;
      el.classList.toggle(CLASS_DRAGGABLE, true);
      const ee = HANDLE_MAP.get(el) || el;
      ee.classList.toggle(CLASS_DRAGGABLE_HANDLE, true);

      if (!isUndefined(this.opts.cursor)) {
        el.style.cursor = this.opts.cursor.default || "move";
        if (isDefined(this.opts.cursor.over)) {
          el.dataset.cursorOver = this.opts.cursor.over;
          el.dataset.cursorActive = this.opts.cursor.active || "move";
        }
      }

      OPTION_MAP.set(el, this.opts)
    });
  }

  bindEvent(
    bindTarget: Element
  ) {
    const container = this.__container;
    let draggableList: any = this.ele;
    const eleString = this.eleString;
    const initStyle = this.__initStyle.bind(this);
    this.addPointerDown(
      bindTarget,
      ({
        ev,
        currentCStyle,
        onPointerStart,
        onPointerMove,
        onPointerEnd,
      }) => {
        let t = ev.target as HTMLElement;
        if (!t) return true;

        let opts: Record<string, any> = {}
        //find drag dom & handle
        let findRs = closest<HTMLElement | SVGGraphicsElement>(
          t,
          (node: Element) => node && get(node, UII_KEY),
          "parentElement"
        );
        if (!findRs || isEmpty(OPTION_MAP.get(findRs))) {
          let toBreak = true
          each(WATCH_MAP, (v, k) => {
            draggableList = bindTarget.querySelectorAll(eleString);
            if (!isEmpty(draggableList) && (findRs = closest<HTMLElement | SVGGraphicsElement>(t, (node) => includes(draggableList, node), "parentNode"))) {
              initStyle(draggableList);
              opts = v.opts
              v.__initHandle(draggableList)
              toBreak = false
              return false
            }
          })
          if (toBreak)
            return true;
        }
        const dragDom: HTMLElement | SVGGraphicsElement = findRs!;

        let handle = HANDLE_MAP.get(dragDom) as HTMLElement;
        if (handle && !isCustomElement(t) && !handle.contains(t as Node)) {
          return true;
        }

        if (isEmpty(opts))
          opts = OPTION_MAP.get(dragDom)
        if (!opts || isEmpty(opts)) return true

        if (opts.self && dragDom !== t) return true;

        //检测
        const onPointerDown = opts.onPointerDown;
        if (
          onPointerDown &&
          onPointerDown({ draggable: dragDom, handle }, ev) === false
        )
          return true;

        const filter = opts.filter;

        //check filter
        if (filter) {
          if (some(dragDom.querySelectorAll(filter), (ele) => ele.contains(t)))
            return true;
        }

        //用于计算鼠标移动时当前位置
        let offsetParent: Element;
        let offsetParentRect: DOMRect;
        let offsetParentCStyle: CSSStyleDeclaration;
        let scrollParent: HTMLElement | null;
        let scrollViewportRect: { x: number; y: number; width: number; height: number } | null;
        // 拖拽开始时的滚动位置，以及滚动定时器已经补偿掉的位移
        let startScrollLeft = 0;
        let startScrollTop = 0;
        let compensatedX = 0;
        let compensatedY = 0;

        let offsetPointX = 0;
        let offsetPointY = 0;

        const inContainer = !!container;
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        const ghostTo = opts.ghostTo;
        const direction = opts.direction;

        const onStart = opts.onStart;
        const onDrag = opts.onDrag;
        const onEnd = opts.onEnd;
        const onClone = opts.onClone;

        const originalZIndex = currentCStyle.zIndex;
        let zIndex = opts.zIndex || originalZIndex;
        const classes = opts.classes || "";

        const group = opts.group;

        const scroll = opts.scroll;
        const scrollSpeed = opts.scrollSpeed || 10;

        let gridX: number | undefined, gridY: number | undefined;

        const snapOn = opts.snap;
        // 吸附目标在拖动开始时冻结，与旧版行为一致
        let snapTargets: Element[] = [];
        let snapRects: Rect[] = [];
        const snapTolerance = opts.snapOptions?.tolerance || 10;
        const snapToleranceY = opts.snapOptions?.toleranceY || snapTolerance;
        const snapPoints: SnapPoint[] | undefined = opts.snapOptions?.points;
        const snapStrategy = opts.snapOptions?.strategy;
        const snapRoot = resolveSnapRoot(
          opts,
          container,
          (this.ele[0] as Element)?.parentElement || null
        );
        const onSnap = opts.onSnap;
        let lastSnapDirY = "",
          lastSnapDirX = "";
        let lastSnapping = "";

        const dragDomRect = dragDom.getBoundingClientRect();
        let originW: number;
        let originH: number;

        // boundary
        let minX: number = 0;
        let minY: number = 0;
        let maxX: number = 0;
        let maxY: number = 0;

        let ghostNode: HTMLElement | SVGGraphicsElement;
        let transform: UiiTransform;

        let timer: any = null;
        let toLeft = false;
        let toTop = false;
        let toRight = false;
        let toBottom = false;

        let endX = 0,
          endY = 0;

        let dragging = false;
        let snapTimer: any = null;

        let startMatrixInfo: any
        let startPointXy: { x: number, y: number }

        //bind events
        onPointerStart(function (args: Record<string, any>) {
          const { ev } = args;

          dragging = true;

          ///////////////////////// initial states start;
          offsetParent =
            dragDom instanceof HTMLElement
              ? dragDom.offsetParent || document.body
              : dragDom.ownerSVGElement!;

          scrollParent = getScrollParent(offsetParent as Element, container);
          scrollViewportRect = scrollParent
            ? getScrollViewportRect(scrollParent)
            : null;
          startScrollLeft = scrollParent ? scrollParent.scrollLeft : 0;
          startScrollTop = scrollParent ? scrollParent.scrollTop : 0;
          compensatedX = 0;
          compensatedY = 0;

          offsetParentRect = offsetParent.getBoundingClientRect();
          offsetParentCStyle = window.getComputedStyle(offsetParent);

          startMatrixInfo = getMatrixInfo(dragDom, true);

          const offsetXy = getPointInContainer(ev, dragDom, undefined, undefined, startMatrixInfo);
          offsetPointX = offsetXy.x;
          offsetPointY = offsetXy.y;

          startPointXy = getPointInContainer(
            ev,
            offsetParent as any,
            offsetParentRect,
            offsetParentCStyle,
            startMatrixInfo
          );

          originW =
            dragDomRect.width
          originH =
            dragDomRect.height

          //svg group el
          if (dragDom instanceof SVGGElement || dragDom instanceof SVGSVGElement) {
            let bbox = dragDom.getBBox()
            offsetPointX += bbox.x
            offsetPointY += bbox.y
          }

          if (startMatrixInfo.angle != 0) {
            let { sx, sy } = getCenterXy(dragDom as HTMLElement);

            offsetPointX = startPointXy.x - sx;
            offsetPointY = startPointXy.y - sy;
          }

          if (group) {
            let i = -1;
            each(DRAGGER_GROUPS[group], (el) => {
              const z = parseInt(currentCStyle.zIndex) || 0;
              if (z > i) i = z;
            });
            zIndex = i + 1;
          }

          const grid = opts.grid;
          if (isArray(grid)) {
            gridX = grid[0] as number;
            gridY = grid[1] as number;
          } else if (isNumber(grid)) {
            gridX = gridY = grid;
          }

          if (snapOn) {
            //获取可吸附对象
            snapTargets = reject(
              resolveSnapTargets(snapOn, snapRoot),
              (el: any) => el === dragDom
            );
            snapRects = map(snapTargets, (el) => {
              const { x, y, w, h } = getRectInContainer(
                el,
                offsetParent as any,
                startMatrixInfo
              );
              return { x, y, w, h };
            });
          }

          if (inContainer) {
            maxX =
              container.scrollWidth - originW / startMatrixInfo.scale
            maxY =
              container.scrollHeight - originH / startMatrixInfo.scale
          }
          if (maxX < 0) maxX = 0;
          if (maxY < 0) maxY = 0;
          ///////////////////////// initial states end;

          if (ghost) {
            if (isFunction(ghost)) {
              ghostNode = ghost(dragDom as any);
            } else {
              ghostNode = dragDom.cloneNode(true) as HTMLElement;
              ghostNode.style.opacity = "0.3";
              ghostNode.style.pointerEvents = "none";
              ghostNode.style.position = "absolute";
            }

            ghostNode.style.zIndex = zIndex + "";

            if (ghostClass) {
              ghostNode.classList.add(...compact(split(ghostClass, " ")));
            }
            ghostNode.classList.add(...compact(split(classes, " ")));
            ghostNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true);
            let ghostParent = ghostTo ? (isString(ghostTo) ? document.querySelector(ghostTo) : ghostTo) : dragDom.parentNode;
            ghostParent?.appendChild(ghostNode);

            transform = wrapper(ghostNode, opts.useTransform);

            onClone && onClone({ clone: ghostNode, draggable: dragDom }, ev);
          } else {
            transform = wrapper(dragDom, opts.useTransform);
          }
          //apply classes
          dragDom.classList.add(...compact(split(classes, " ")));
          if (!ghostNode) dragDom.style.zIndex = zIndex + "";

          dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE, true);

          onStart &&
            onStart(
              { draggable: dragDom, x: startPointXy.x, y: startPointXy.y, transform },
              ev
            );

          //notify
          const customEv = new CustomEvent("uii-dragactive", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: { target: dragDom }
          });
          dragDom.dispatchEvent(customEv);
        });
        onPointerMove((args: Record<string, any>) => {
          const { ev, pointX, pointY, offX, offY } = args;

          const scrollDeltaX = scrollParent
            ? scrollParent.scrollLeft - startScrollLeft - compensatedX
            : 0;
          const scrollDeltaY = scrollParent
            ? scrollParent.scrollTop - startScrollTop - compensatedY
            : 0;

          let newX = startPointXy.x + offX + scrollDeltaX
          let newY = startPointXy.y + offY + scrollDeltaY

          //edge detect
          if (scroll && scrollParent && scrollViewportRect) {
            const sp = scrollParent;
            const vp = scrollViewportRect;
            const lX = pointX - vp.x;
            const lY = pointY - vp.y;
            const rX = vp.x + vp.width - pointX;
            const rY = vp.y + vp.height - pointY;

            toLeft = lX < EDGE_THRESHOLD;
            toTop = lY < EDGE_THRESHOLD;
            toRight = rX < EDGE_THRESHOLD;
            toBottom = rY < EDGE_THRESHOLD;

            if (toLeft || toTop || toRight || toBottom) {
              if (!timer) {
                timer = setInterval(() => {
                  const beforeL = sp.scrollLeft;
                  const beforeT = sp.scrollTop;
                  if (toLeft) {
                    sp.scrollLeft -= scrollSpeed;
                  } else if (toRight) {
                    sp.scrollLeft += scrollSpeed;
                  }
                  if (toTop) {
                    sp.scrollTop -= scrollSpeed;
                  } else if (toBottom) {
                    sp.scrollTop += scrollSpeed;
                  }

                  const dx = sp.scrollLeft - beforeL;
                  const dy = sp.scrollTop - beforeT;
                  if (dx || dy) {
                    compensatedX += dx;
                    compensatedY += dy;

                    let nx = transform.x + dx;
                    let ny = transform.y + dy;
                    if (inContainer) {
                      if (nx < minX) nx = 0;
                      if (ny < minY) ny = 0;
                      if (nx > maxX) nx = maxX;
                      if (ny > maxY) ny = maxY;
                    }
                    if (direction === "v") {
                      transform.moveToY(ny);
                    } else if (direction === "h") {
                      transform.moveToX(nx);
                    } else {
                      transform.moveTo(nx, ny);
                    }
                  }
                }, 20);
              }
            } else {
              if (timer) {
                clearInterval(timer);
                timer = null;
              }
            }
          }

          let x = newX - offsetPointX;
          let y = newY - offsetPointY;

          //grid
          if (isNumber(gridX) && isNumber(gridY)) {
            x = snapToGrid(x, gridX);
            y = snapToGrid(y, gridY);
          }

          if (inContainer) {
            if (x < minX) {
              x = 0;
            }
            if (y < minY) {
              y = 0;
            }
            if (x > maxX) {
              x = maxX;
            }
            if (y > maxY) {
              y = maxY;
            }
          }
          let canDrag = true;
          let emitSnap = false;

          if (snapOn && snapRects.length) {
            const scale = startMatrixInfo.scale || 1;
            const snapResult = findSnap(
              { x, y, w: originW / scale, h: originH / scale },
              snapRects,
              {
                tolerance: snapTolerance,
                toleranceY: snapToleranceY,
                points: snapPoints,
                strategy: snapStrategy,
              }
            );
            // 单向拖动的轴不参与吸附
            if (direction === "v") {
              snapResult.dx = 0;
              snapResult.hitX = undefined;
            } else if (direction === "h") {
              snapResult.dy = 0;
              snapResult.hitY = undefined;
            }

            if (snapResult.dx || snapResult.dy) {
              x += snapResult.dx;
              y += snapResult.dy;
              lastSnapDirX = snapDir(snapResult.hitX);
              lastSnapDirY = snapDir(snapResult.hitY);
              if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
                // 取出后随闭包携带，避免 setTimeout 回调读到后续帧的结果
                const hitX = snapResult.hitX;
                const hitY = snapResult.hitY;
                const snapDx = snapResult.dx;
                const snapDy = snapResult.dy;
                clearTimeout(snapTimer);
                snapTimer = setTimeout(() => {
                  //emit after relocate
                  if (!dragging) return;
                  onSnap(
                    {
                      el: ghostNode || dragDom,
                      targetH: hitX ? (snapTargets[hitX.targetIndex] as any) : undefined,
                      targetV: hitY ? (snapTargets[hitY.targetIndex] as any) : undefined,
                      dirH: snapDir(hitX),
                      dirV: snapDir(hitY),
                      dx: snapDx,
                      dy: snapDy,
                    },
                    ev
                  );
                }, 0);

                lastSnapping = lastSnapDirX + "" + lastSnapDirY;
              }

              emitSnap = true;
            } else {
              lastSnapDirX = lastSnapDirY = lastSnapping = "";
            }
          }

          if (onDrag && !emitSnap) {
            if (
              onDrag(
                {
                  draggable: dragDom,
                  ox: offX,
                  oy: offY,
                  x: x,
                  y: y,
                  transform,
                },
                ev
              ) === false
            ) {
              canDrag = false;
              endX = x;
              endY = y;
            }
          }
          if (canDrag) {
            if (direction === "v") {
              transform.moveToY(y);
            } else if (direction === "h") {
              transform.moveToX(x);
            } else {
              transform.moveTo(x, y);
            }
            endX = x;
            endY = y;
          }
        });
        onPointerEnd((args: Record<string, any>) => {
          const { ev, currentStyle } = args;

          dragging = false;
          clearTimeout(snapTimer);
          snapTimer = null;

          if (scroll) {
            if (timer) {
              clearInterval(timer);
              timer = null;
            }
          }

          //restore classes
          dragDom.classList.remove(...compact(split(classes, " ")));
          currentStyle.zIndex = originalZIndex;

          dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE);

          let moveToGhost = true;
          if (onEnd) {
            moveToGhost =
              onEnd({ draggable: dragDom, x: endX, y: endY, transform, ghost: ghostNode }, ev) ===
                false
                ? false
                : true;
          }
          //notify
          const customEv = new CustomEvent("uii-dragdeactive", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
              target: dragDom
            }
          });
          dragDom.dispatchEvent(customEv);

          if (ghost) {
            ghostNode.parentNode?.removeChild(ghostNode);
            if (moveToGhost !== false) {
              let transf = wrapper(dragDom, opts.useTransform)
              if (direction === "v") {
                transf.moveToY(endY);
              } else if (direction === "h") {
                transf.moveToX(endX);
              } else {
                transf.moveTo(endX, endY);
              }
            }
          }
        });
      }
    );
  }

  /**
   * @internal
   */
  onOptionChanged(opts: Record<string, any>) {
    const droppable = opts.droppable;
    if (!isFunction(droppable)) {
      if (isUndefined(droppable)) {
        opts.droppable = () => { };
      } else if (isString(droppable)) {
        opts.droppable = () => document.querySelectorAll(droppable);
      } else if (isArrayLike(droppable)) {
        opts.droppable = () => droppable;
      } else if (isElement(droppable)) {
        opts.droppable = () => [droppable];
      }
    }
  }
}

/**
 * create a draggable pattern for one or more elements with opts
 * @param els selector string / html element
 * @param opts
 * @returns Draggable instance
 */
export function newDraggable(
  els: string | HTMLElement | Array<string | HTMLElement> | NodeListOf<Element>,
  opts?: DraggableOptions
): Draggable {
  return new Draggable(els, opts);
}

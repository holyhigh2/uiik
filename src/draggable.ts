/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * dom dragger
 * @author holyhigh2
 */
import {
  isString,
  isArrayLike,
  isFunction,
  isUndefined,
  each,
  isElement,
  closest,
  map,
  isArray,
  isNumber,
  assign,
  compact,
  split,
  some,
  call,
  isDefined,
} from "@holyhigh/func.js";
import { DraggableOptions, Uii } from "./types";
import { EDGE_THRESHOLD, getOffset, lockPage, unlockPage } from "./utils";

const DRAGGER_GROUPS:Record<string, Array<HTMLElement>> = {}
const CLASS_DRAGGABLE = "uii-draggable";
const CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
const CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
const CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";

/**
 * 用于表示一个或多个可拖动元素的定义
 * > 可用CSS接口
 * - .uii-draggable
 * - .uii-draggable-handle
 * - .uii-draggable-active
 * - .uii-draggable-ghost
 * @public
 */
export class Draggable extends Uii {
  #handleMap = new WeakMap();

  constructor(
    els: string | HTMLElement | Array<string | HTMLElement>,
    opts?: DraggableOptions
  ) {
    super(
      els,
      assign(
        {
          container: false,
          threshold: 0,
          ghost: false,
          direction: "",
          scroll:true,
          snapOptions: {
            tolerance: 10,
          }
        },
        opts
      )
    );

    if (this.opts.handle) {
      each(this.ele, (el) => {
        const h = el.querySelector(this.opts.handle);
        if (!h) {
          console.error('No handle found "' + this.opts.handle + '"');
          return false;
        }
        this.#handleMap.set(el, h);
      });
    }

    this.onOptionChanged(this.opts);

    //put into group
    if(this.opts.group){
      if(!DRAGGER_GROUPS[this.opts.group]){
        DRAGGER_GROUPS[this.opts.group] = []
      }
      DRAGGER_GROUPS[this.opts.group].push(...this.ele)
    }

    each(this.ele, (el) => {
      bindEvent(this.registerEvent.bind(this),el, this.opts, this.#handleMap);
      if (isDefined(this.opts.type))
        el.dataset.dropType = this.opts.type
      el.classList.toggle(CLASS_DRAGGABLE,true)
      const ee = this.#handleMap.get(el) || el
      ee.classList.toggle(CLASS_DRAGGABLE_HANDLE,true)

      if (isDefined(this.opts.cursor)){
        el.style.cursor = this.opts.cursor.default || 'move'
        if(isDefined(this.opts.cursor.over)){
          el.dataset.cursorOver = this.opts.cursor.over
          el.dataset.cursorActive = this.opts.cursor.active || 'move'
        }
      }
    });
  }

  /**
   * @internal
   */
  onOptionChanged(opts: Record<string, any>) {
    const droppable = opts.droppable;
    if (!isFunction(droppable)) {
      if (isUndefined(droppable)) {
        opts.droppable = () => {};
      } else if (isString(droppable)) {
        opts.droppable = () => document.querySelectorAll(droppable);
      } else if (isArrayLike(droppable)) {
        opts.droppable = () => droppable;
      } else if (isElement(droppable)) {
        opts.droppable = () => [droppable];
      }
    }

    if (opts.snap) {
      opts.snapTargets = map(document.querySelectorAll(opts.snap), (el) => {
        let offX = 0,
          offY = 0;
        closest(
          el,
          (el) => {
            offX += el.offsetLeft;
            offY += el.offsetTop;
            return false;
          },
          "offsetParent"
        );
        return {
          x1: offX,
          y1: offY,
          x2: offX + el.offsetWidth,
          y2: offY + el.offsetHeight,
          el: el,
        };
      });
    }
  }
}

function bindEvent(
  registerEvent:Function,
  el: HTMLElement,
  opts: Record<string, any>,
  handleMap: WeakMap<HTMLElement, HTMLElement>
) {
  registerEvent(el, "mousedown", (e: MouseEvent) => {
    // get options
    let dragDom = e.currentTarget as HTMLElement;
    let t = e.target as HTMLElement
    if(!t)return;

    let handle = handleMap.get(dragDom)
    if(handle && !handle.contains(t as Node)){
      return
    }

    const filter = opts.filter

    //check filter
    if(filter){
      if(some(el.querySelectorAll(filter),ele=>ele.contains(t)))return
    }

    const computedStyle = window.getComputedStyle(dragDom)

    const container = dragDom.offsetParent || document.body;

    const inContainer = opts.container;
    const threshold = opts.threshold;
    const ghost = opts.ghost;
    const ghostClass = opts.ghostClass;
    const direction = opts.direction;

    const onStart = opts.onStart;
    const onDrag = opts.onDrag;
    const onEnd = opts.onEnd;
    const onClone = opts.onClone;

    const originalZIndex = computedStyle.zIndex
    let zIndex = opts.zIndex || originalZIndex
    const classes = opts.classes

    const group = opts.group
    if(group){
      let i = -1
      each(DRAGGER_GROUPS[group],el=>{
        const z = parseInt(window.getComputedStyle(el).zIndex)
        if(z>i)i = z
      })
      zIndex = i + 1
    }

    const scroll = opts.scroll;
    const scrollSpeed = opts.scrollSpeed || 10;

    let gridX: number | undefined, gridY: number | undefined;
    const grid = opts.grid;
    if (isArray(grid)) {
      gridX = grid[0];
      gridY = grid[1];
    } else if (isNumber(grid)) {
      gridX = gridY = grid;
    }

    const snapOn = opts.snap;
    const snappable = opts.snapTargets;
    const snapTolerance = opts.snapOptions.tolerance;
    const onSnap = opts.onSnap;
    let lastSnapDirY = "",
      lastSnapDirX = "";
    let lastSnapping = "";
    let parentOffsetX = 0,
      parentOffsetY = 0;
    if (snapOn) {
      closest(
        dragDom,
        (el, times) => {
          if (times > 0) {
            parentOffsetX += el.offsetLeft;
            parentOffsetY += el.offsetTop;
          }
          return false;
        },
        "offsetParent"
      );
    }

    const originW = dragDom.offsetWidth + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
    const originH = dragDom.offsetHeight + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);

    // boundary
    let minX: number;
    let minY: number;
    let maxX: number;
    let maxY: number;
    if (inContainer) {
      minX = 0;
      minY = 0;
      maxX = container.scrollWidth - originW 
      maxY = container.scrollHeight - originH 
    }

    //start point
    const rect = container.getBoundingClientRect();
    const offset = getOffset(t, container as HTMLElement);
    const ox = e.offsetX||0
    const oy = e.offsetY||0
    let hitPosX = offset.x + ox + container.scrollLeft
    let hitPosY = offset.y + oy + container.scrollTop

    let cursorX = ox,
    cursorY = e.offsetY;
    if (e.target !== dragDom) {
      const offset = getOffset(t, dragDom);
      const style = window.getComputedStyle(t)
      cursorX = offset.x + ox + parseFloat(style.borderLeftWidth);
      cursorY = offset.y + oy + parseFloat(style.borderTopWidth);
    }

    const cursorAt = opts.cursorAt
    if(cursorAt){
      const l = cursorAt.left
      const t = cursorAt.top
      if(isString(l)){
        cursorX = parseFloat(l) / 100 * dragDom.offsetWidth
      }else{
        cursorX = l
      }
      if(isString(t)){
        cursorY = parseFloat(t) / 100 * dragDom.offsetWidth
      }else{
        cursorY = t
      }
    }

    const style = dragDom.style;

    let dragging = false;
    let copyNode: HTMLElement;

    let timer: any = null;
    let toLeft = false
    let toTop = false
    let toRight = false
    let toBottom = false

    let bodyCursor = document.body.style.cursor

    const dragListener = (ev: MouseEvent) => {
      const newX = ev.clientX - rect.x + container.scrollLeft;
      const newY = ev.clientY - rect.y + container.scrollTop;

      let offsetx = newX - hitPosX;
      let offsety = newY - hitPosY;

      if (!dragging) {
        if (Math.abs(offsetx) > threshold || Math.abs(offsety) > threshold) {
          dragging = true;

          if (ghost) {
            if (isFunction(ghost)) {
              copyNode = ghost(dragDom);
            } else {
              copyNode = dragDom.cloneNode(true) as HTMLElement;
              copyNode.style.opacity = "0.3";
              copyNode.style.pointerEvents = "none";
              copyNode.style.position = "absolute";
            }

            copyNode.style.left = dragDom.style.left;
            copyNode.style.top = dragDom.style.top;
            copyNode.style.zIndex = zIndex

            if (ghostClass) {
              copyNode.classList.add(...compact(split(ghostClass,' ')))
            }
            copyNode.classList.add(...compact(split(classes,' ')))
            copyNode.classList.toggle(CLASS_DRAGGABLE_GHOST,true)
            dragDom.parentNode?.appendChild(copyNode);
            if (onClone) {
              onClone(copyNode, ev);
            }
          }
          //apply classes
          dragDom.classList.add(...compact(split(classes,' ')))
          dragDom.style.zIndex = zIndex

          dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE,true)

          call(onStart,dragDom, ev)

          lockPage()
          if (isDefined(opts.cursor)){
            document.body.style.cursor = opts.cursor.active || 'move'
          }
          
          //notify
          const customEv = new Event("uii-dragactive", {"bubbles":true, "cancelable":false});
          dragDom.dispatchEvent(customEv);
        } else {
          ev.preventDefault();
          return false;
        }
      }

      //edge detect
      if (scroll) {
        const ltX = ev.clientX - rect.x;
        const ltY = ev.clientY - rect.y;
        const rbX = rect.x + rect.width - ev.clientX;
        const rbY = rect.y + rect.height - ev.clientY;

        toLeft = ltX < EDGE_THRESHOLD
        toTop = ltY < EDGE_THRESHOLD
        toRight = rbX < EDGE_THRESHOLD
        toBottom = rbY < EDGE_THRESHOLD

        if (
          toLeft||toTop
           ||
           toRight || toBottom
        ) {
          if (!timer) {
            timer = setInterval(() => {
              if (toLeft) {
                container.scrollLeft -= scrollSpeed;
              } else if(toRight){
                container.scrollLeft += scrollSpeed;
              }
              if (toTop) {
                container.scrollTop -= scrollSpeed;
              } else if(toBottom){
                container.scrollTop += scrollSpeed;
              }
            }, 20);
          }
        }else{
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      }

      let x = newX - cursorX
      let y = newY - cursorY

      //grid
      if (isNumber(gridX) && isNumber(gridY)) {
        x = ((x / gridX) >> 0) * gridX;
        y = ((y / gridY) >> 0) * gridY;
      }

      if (inContainer) {
        if (x < minX) x = minX;
        if (y < minY) y = minY;
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
      }
      let canDrag = true;
      let emitSnap = false;
      if (snapOn) {
        const currPageX1 = parentOffsetX + x;
        const currPageY1 = parentOffsetY + y;
        const currPageX2 = currPageX1 + originW;
        const currPageY2 = currPageY1 + originH;
        //check snappable
        let snapX: number = NaN,
          snapY: number = NaN;
        let targetX: HTMLElement, targetY: HTMLElement;
        let snapDirX: string, snapDirY: string;
        if (!direction || direction === "v") {
          each<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            el: HTMLElement;
          }>(snappable, (data) => {
            if (Math.abs(data.y1 - currPageY1) <= snapTolerance) {
              //top parallel
              snapY = data.y1;
              snapDirY = "t2t";
            } else if (Math.abs(data.y2 - currPageY1) <= snapTolerance) {
              //b2t
              snapY = data.y2;
              snapDirY = "t2b";
            } else if (Math.abs(data.y1 - currPageY2) <= snapTolerance) {
              //t2b
              snapY = data.y1 - originH;
              snapDirY = "b2t";
            } else if (Math.abs(data.y2 - currPageY2) <= snapTolerance) {
              //bottom parallel
              snapY = data.y2 - originH;
              snapDirY = "b2b";
            }
            if (snapY) {
              lastSnapDirY = snapDirY;
              targetY = data.el;
              return false;
            }
          });
        }

        if (!direction || direction === "h") {
          each<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            el: HTMLElement;
          }>(snappable, (data) => {
            if (Math.abs(data.x1 - currPageX1) <= snapTolerance) {
              //left parallel
              snapX = data.x1;
              snapDirX = "l2l";
            } else if (Math.abs(data.x2 - currPageX1) <= snapTolerance) {
              //r2l
              snapX = data.x2;
              snapDirX = "l2r";
            } else if (Math.abs(data.x1 - currPageX2) <= snapTolerance) {
              //l2r
              snapX = data.x1 - originW;
              snapDirX = "r2l";
            } else if (Math.abs(data.x2 - currPageX2) <= snapTolerance) {
              //right parallel
              snapX = data.x2 - originW;
              snapDirX = "r2r";
            }

            if (snapX) {
              lastSnapDirX = snapDirX;
              targetX = data.el;
              return false;
            }
          });
        }

        if (snapX || snapY) {
          if (snapX) {
            x = snapX - parentOffsetX;
          }
          if (snapY) {
            y = snapY - parentOffsetY;
          }
          if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
            setTimeout(() => {
              //emit after relocate
              onSnap(
                copyNode || dragDom,
                targetX,
                targetY,
                snapDirX,
                snapDirY
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
        if (onDrag(dragDom, ev, offsetx, offsety,x,y) === false) {
          canDrag = false;
        }
      }
      if (canDrag) {
        if (copyNode) {
          if (direction === "v") {
            copyNode.style.top = `${y}px`;
          } else if (direction === "v") {
            copyNode.style.left = `${x}px`;
          } else {
            copyNode.style.left = `${x}px`;
            copyNode.style.top = `${y}px`;
          }
        } else {
          if (direction === "v") {
            style.top = `${y}px`;
          } else if (direction === "v") {
            style.left = `${x}px`;
          } else {
            style.left = `${x}px`;
            style.top = `${y}px`;
          }
        }
      }

      ev.preventDefault();
      return false;
    };
    const dragEndListener = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", dragListener);
      document.removeEventListener("mouseup", dragEndListener);
      window.removeEventListener("blur", dragEndListener);

      if (scroll) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      //restore classes
      dragDom.classList.remove(...compact(split(classes,' ')))
      dragDom.style.zIndex = originalZIndex

      dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE)

      let moveToGhost = true;
      if (dragging) {
        moveToGhost = call(onEnd,dragDom, ev);
      }
      //notify
      const customEv = new Event("uii-dragdeactive", {"bubbles":true, "cancelable":false});
      dragDom.dispatchEvent(customEv);

      if (dragging) {
        unlockPage()
        document.body.style.cursor = bodyCursor

        if (ghost){
          dragDom.parentNode?.removeChild(copyNode);
          if (moveToGhost !== false) {
            style.left = copyNode.style.left;
            style.top = copyNode.style.top;
          }
        }          
      }

    };

    document.addEventListener("mousemove", dragListener);
    document.addEventListener("mouseup", dragEndListener);
    window.addEventListener("blur", dragEndListener);

    e.preventDefault();
    return false;
  });
}

/**
 * create a draggable pattern for one or more elements with opts
 * @param els selector string / html element
 * @param opts 
 * @returns Draggable instance
 */
export function newDraggable(
  els: string | HTMLElement | Array<string | HTMLElement>,
  opts?: DraggableOptions
): Draggable {
  return new Draggable(els, opts);
}

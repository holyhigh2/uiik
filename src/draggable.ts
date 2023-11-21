/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * dom dragger
 * @author holyhigh2
 */
import {
  each,
  find,
  map,
  some,
} from "myfx/collection"
import {assign} from 'myfx/object'
import {split} from 'myfx/string'
import { compact} from 'myfx/array'
import {
  isString,
  isArrayLike,
  isFunction,
  isUndefined,
  isElement,
  isArray,
  isNumber,
  isDefined,
  isBoolean,
  isEmpty,
} from 'myfx/is'

import { DraggableOptions, Uii } from "./types";
import { EDGE_THRESHOLD, getMatrixInfo, getPointInContainer, getRectInContainer } from "./utils";
import { UiiTransformer, wrapper } from "./transform"

const DRAGGER_GROUPS:Record<string, Array<HTMLElement>> = {}
const CLASS_DRAGGABLE = "uii-draggable";
const CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
const CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
const CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";


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
  #handleMap = new WeakMap();
  #container: HTMLElement | null = null

  constructor(
    els: string | HTMLElement | Array<string | HTMLElement>,
    opts?: DraggableOptions
  ) {
    super(
      els,
      assign(
        {
          containment: false,
          watch:true,
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

    this.#initStyle(this.ele)

    //containment
    if (this.opts.containment){
      if (isBoolean(this.opts.containment)){
        this.#container = isEmpty(this.ele)?null:this.ele[0].parentElement
      } else if (isString(this.opts.containment)) {
        this.#container = document.querySelector(this.opts.containment)
      } else if (isElement(this.opts.containment)) {
        this.#container = this.opts.containment as HTMLElement
      }
    }
    
    if (this.opts.watch && this.eleString){
      let con
      if (isString(this.opts.watch)){
        con = document.querySelector(this.opts.watch)
      }else{
        con = isEmpty(this.ele) ? null : this.ele[0].parentElement
      }

      this.bindEvent(con || document.body, this.opts, this.#handleMap);
    }else{
      each(this.ele, (el) => {
        this.bindEvent(el, this.opts, this.#handleMap);
      })
    }
  }

  //初始化样式
  #initStyle(draggableList: HTMLElement[]){
    each(draggableList, (el) => {
      if (isDefined(this.opts.type))
        el.dataset.dropType = this.opts.type
      el.classList.toggle(CLASS_DRAGGABLE, true)
      const ee = this.#handleMap.get(el) || el
      ee.classList.toggle(CLASS_DRAGGABLE_HANDLE, true)

      if (!isUndefined(this.opts.cursor)) {
        el.style.cursor = this.opts.cursor.default || 'move'
        if (isDefined(this.opts.cursor.over)) {
          el.dataset.cursorOver = this.opts.cursor.over
          el.dataset.cursorActive = this.opts.cursor.active || 'move'
        }
      }
    });
  }

  bindEvent(
    bindTarget:Element,
    opts: DraggableOptions,
    handleMap: WeakMap<Element, Element>
  ) {
    const container = this.#container
    let draggableList:any = this.ele
    const eleString = this.eleString
    const initStyle = this.#initStyle.bind(this)
    this.addPointerDown(bindTarget, ({ev, currentTarget, currentStyle, currentCStyle, pointX, pointY, onPointerStart, onPointerMove, onPointerEnd }) => {
      let t = ev.target as HTMLElement
      if (!t) return true;

      //refresh draggableList
      if (opts.watch && eleString){
        draggableList = bindTarget.querySelectorAll(eleString)
        initStyle(draggableList)
      }

      //find drag dom & handle
      let findRs = find<HTMLElement | SVGGraphicsElement>(draggableList,el=>el.contains(t))
      if (!findRs)return true
      const dragDom: HTMLElement | SVGGraphicsElement = findRs

      let handle = handleMap.get(dragDom)
      if (handle && !handle.contains(t as Node)) {
        return true
      }

      //检测
      const onPointerDown = opts.onPointerDown;
      if (onPointerDown && onPointerDown({ draggable: dragDom },ev) === false) return true;

      const filter = opts.filter

      //check filter
      if (filter) {
        if (some(dragDom.querySelectorAll(filter), ele => ele.contains(t))) return true
      }

      //用于计算鼠标移动时当前位置
      const offsetParent = dragDom instanceof HTMLElement ? dragDom.offsetParent || document.body : dragDom.ownerSVGElement!
      
      const offsetParentRect = offsetParent.getBoundingClientRect()
      const offsetParentCStyle = window.getComputedStyle(offsetParent)

      const offsetXy = getPointInContainer(ev,dragDom)
      let offsetPointX = offsetXy.x
      let offsetPointY = offsetXy.y

      const matrixInfo = getMatrixInfo(dragDom)
      const currentXy = getPointInContainer(ev, offsetParent as any, offsetParentRect, offsetParentCStyle)
      if (matrixInfo.angle != 0) {
        offsetPointX = currentXy.x - matrixInfo.x
        offsetPointY = currentXy.y - matrixInfo.y
      }      

      const inContainer = !!container;
      const ghost = opts.ghost;
      const ghostClass = opts.ghostClass;
      const direction = opts.direction;

      const onStart = opts.onStart;
      const onDrag = opts.onDrag;
      const onEnd = opts.onEnd;
      const onClone = opts.onClone;

      const originalZIndex = currentCStyle.zIndex
      let zIndex = opts.zIndex || originalZIndex
      const classes = opts.classes || ''

      const group = opts.group
      if (group) {
        let i = -1
        each(DRAGGER_GROUPS[group], el => {
          const z = parseInt(currentCStyle.zIndex) || 0
          if (z > i) i = z
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
      let snappable: Array<any>
      const snapTolerance = opts.snapOptions?.tolerance || 10;
      const onSnap = opts.onSnap;
      let lastSnapDirY = "",
        lastSnapDirX = "";
      let lastSnapping = "";
      if (snapOn) {
        //获取拖动元素所在容器内的可吸附对象
        snappable = map((container||document).querySelectorAll(snapOn), (el) => {
          //计算相对容器xy
          const {x,y,w,h} = getRectInContainer(el,offsetParent as any)

          return {
            x1:x,
            y1:y,
            x2: x + w,
            y2: y + h,
            el: el,
          };
        });
      }

      const dragDomRect = dragDom.getBoundingClientRect()

      const originW = dragDomRect.width + parseFloat(currentCStyle.borderLeftWidth) + parseFloat(currentCStyle.borderRightWidth);
      const originH = dragDomRect.height + parseFloat(currentCStyle.borderTopWidth) + parseFloat(currentCStyle.borderBottomWidth);

      // boundary
      let minX: number = 0;
      let minY: number = 0;
      let maxX: number = 0;
      let maxY: number = 0;
      let originOffX = 0
      let originOffY = 0

      if (inContainer) {
        maxX = container.scrollWidth - originW
        maxY = container.scrollHeight - originH
      }
      if (maxX < 0) maxX = 0
      if (maxY < 0) maxY = 0

      let copyNode: HTMLElement;
      let transformer: UiiTransformer;

      let timer: any = null;
      let toLeft = false
      let toTop = false
      let toRight = false
      let toBottom = false

      let endX = 0,endY = 0

      //bind events
      onPointerStart(function (args: Record<string, any>) {
        const { ev } = args

        if (ghost) {
          if (isFunction(ghost)) {
            copyNode = ghost(dragDom as any);
          } else {
            copyNode = dragDom.cloneNode(true) as HTMLElement;
            copyNode.style.opacity = "0.3";
            copyNode.style.pointerEvents = "none";
            copyNode.style.position = "absolute";
          }

          copyNode.style.zIndex = zIndex + ''

          if (ghostClass) {
            copyNode.classList.add(...compact(split(ghostClass, ' ')))
          }
          copyNode.classList.add(...compact(split(classes, ' ')))
          copyNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true)
          dragDom.parentNode?.appendChild(copyNode);

          transformer = wrapper(copyNode)

          onClone && onClone({ clone: copyNode }, ev);
        }else{
          transformer = wrapper(dragDom)
        }
        //apply classes
        dragDom.classList.add(...compact(split(classes, ' ')))
        if (!copyNode)
          dragDom.style.zIndex = zIndex + ''

        dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE, true)

        onStart && onStart({ draggable: dragDom, x: currentXy.x, y: currentXy.y }, ev)

        //notify
        const customEv = new Event("uii-dragactive", { "bubbles": true, "cancelable": false });
        dragDom.dispatchEvent(customEv);
      })
      onPointerMove((args: Record<string, any>) => {
        const { ev, pointX, pointY, offX, offY } = args

        const currentXy = getPointInContainer(ev, offsetParent as any, offsetParentRect, offsetParentCStyle)
        let newX = currentXy.x
        let newY = currentXy.y

        //edge detect
        if (scroll) {
          const lX = pointX - offsetParentRect.x;
          const lY = pointY - offsetParentRect.y;
          const rX = offsetParentRect.x + offsetParentRect.width - pointX;
          const rY = offsetParentRect.y + offsetParentRect.height - pointY;

          toLeft = lX < EDGE_THRESHOLD
          toTop = lY < EDGE_THRESHOLD
          toRight = rX < EDGE_THRESHOLD
          toBottom = rY < EDGE_THRESHOLD

          if (
            toLeft || toTop
            ||
            toRight || toBottom
          ) {
            if (!timer) {
              timer = setInterval(() => {
                if (toLeft) {
                  offsetParent.scrollLeft -= scrollSpeed;
                } else if (toRight) {
                  offsetParent.scrollLeft += scrollSpeed;
                }
                if (toTop) {
                  offsetParent.scrollTop -= scrollSpeed;
                } else if (toBottom) {
                  offsetParent.scrollTop += scrollSpeed;
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

        let x = newX - offsetPointX 
        let y = newY - offsetPointY 

        //grid
        if (isNumber(gridX) && isNumber(gridY)) {
          x = ((x / gridX) >> 0) * gridX;
          y = ((y / gridY) >> 0) * gridY;
        }

        if (inContainer) {
          if (originOffX + x < minX){
            x = -0;
          }
          if (originOffY + y < minY) {            
            y = -0;
          }
          if (originOffX + x > maxX) {
            x = maxX - originOffX;
          }
          if (originOffY + y > maxY) {
            y = maxY - originOffY;
          }
        }
        let canDrag = true;
        let emitSnap = false;

        if (snapOn) {
          const currPageX1 = x;
          const currPageY1 = y;
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
              x = snapX;
            }
            if (snapY) {
              y = snapY;
            }
            if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
              setTimeout(() => {
                //emit after relocate
                onSnap(
                  {
                    el: copyNode || dragDom,
                    targetH: targetX,
                    targetV: targetY,
                    dirH: snapDirX,
                    dirV: snapDirY,
                  }, ev
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
          if (onDrag({
            draggable: dragDom,
            ox: offX,
            oy: offY,
            x: x,
            y: y
          }, ev) === false) {
            canDrag = false;
            endX = x
            endY = y
          }
        }
        if (canDrag) {
          if (direction === "v") {
            transformer.moveToY(y)
          } else if (direction === "h") {
            transformer.moveToX(x)
          } else {
            transformer.moveTo(x, y)
          }
          endX = x
          endY = y
        }
      })
      onPointerEnd((args: Record<string, any>) => {
        const { ev, currentStyle } = args
        if (scroll) {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }

        //restore classes
        dragDom.classList.remove(...compact(split(classes, ' ')))
        currentStyle.zIndex = originalZIndex

        dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE)

        let moveToGhost = true;
        if (onEnd) {
          moveToGhost = onEnd({ draggable: dragDom, x: endX, y: endY }, ev) === false ? false : true;
        }
        //notify
        const customEv = new Event("uii-dragdeactive", { "bubbles": true, "cancelable": false });
        dragDom.dispatchEvent(customEv);

        if (ghost) {
          dragDom.parentNode?.contains(copyNode) && dragDom.parentNode?.removeChild(copyNode);
          if (moveToGhost !== false) {
            wrapper(dragDom).moveTo(transformer.x,transformer.y)
          }
        }

      })
    }, {
      threshold: this.opts.threshold || 0,
      lockPage: true
    })
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
  }
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

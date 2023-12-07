/* eslint-disable max-len */
/**
 * selector
 * @author holyhigh2
 */
import { each,includes,some } from 'myfx/collection'
import { assign } from 'myfx/object'
import { split } from 'myfx/string'
import { compact } from 'myfx/array'
import { isFunction } from 'myfx/is'
import { CollisionDetector, newCollisionDetector } from "./detector";
import { SelectableOptions, Uii } from "./types";
import { EDGE_THRESHOLD, getMatrixInfo, getPointInContainer } from "./utils";

const CLASS_SELECTOR = "uii-selector";
const CLASS_SELECTING = "uii-selecting";
const CLASS_SELECTED = "uii-selected";
const THRESHOLD = 2;

/**
 * 用于表示一个元素选择器的定义
 * > 可用CSS接口
 * - .uii-selector
 * - .uii-selecting
 * - .uii-selected
 * @public
 */
export class Selectable extends Uii {
  #_detector: CollisionDetector;
  #_lastSelected: HTMLElement[];

  constructor(container: string | HTMLElement, opts?: SelectableOptions) {
    super(
      container,
      assign(
        {
          targets: [],
          scroll: true,
        },
        opts
      )
    );

    const domEl = this.ele[0] as HTMLElement;

    //create selector
    let selector:any = document.createElement("div");
    if (domEl instanceof SVGElement) {
      selector = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    }
    selector.setAttribute('class', CLASS_SELECTOR)
    selector.style.cssText = `
      position:absolute;
      left:0;top:0;
    `;
    if (this.opts.class) {
      selector.setAttribute('class', selector.getAttribute('class') + " " + this.opts.class)
    } else {
      selector.style.cssText += "border:1px dashed #000;stroke:#000;";
    }
    selector.style.display = 'none'
    domEl.appendChild(selector);
    
    //create detector
    this.#_detector = newCollisionDetector(selector, this.opts.targets, {
      container: domEl,
    });

    this.#bindEvent(selector, domEl);
  }

  /**
   *  更新targets
   */
  updateTargets() {
    this.#_detector.update();
  }

  /**
   * @internal
   */
  #bindEvent(selector: HTMLElement, con: HTMLElement) {
    const that = this;
    const opts:SelectableOptions = this.opts

    this.addPointerDown(con, ({ ev,target,currentRect,currentCStyle, currentTarget, onPointerStart, onPointerMove, onPointerEnd }) => {
      const onStart = opts.onStart;
      const onSelect = opts.onSelect;
      const onEnd = opts.onEnd;
      const mode = opts.mode || "overlap";
      const scroll = opts.scroll;
      const scrollSpeed = opts.scrollSpeed || 10;
      const filter = opts.filter;
      const selectingClassAry = compact(split(opts.selectingClass, " "));
      const selectedClassAry = compact(split(opts.selectedClass, " "));

      //check filter
      if (filter) {
        if (isFunction(filter)) {
          if (filter(target)) return true;
        } else if (some(con.querySelectorAll(filter), (el) => el.contains(target)))
        return true;
      }

      //检测
      const onPointerDown = opts.onPointerDown;
      if (onPointerDown && onPointerDown(ev) === false)return true;

      let originPos = "";

      let matrixInfo = getMatrixInfo(currentTarget)
      const startxy = getPointInContainer(ev, con, currentRect, currentCStyle, matrixInfo)
      let hitPosX = startxy.x
      let hitPosY = startxy.y

      const style = selector.style;

      let selection: HTMLElement[] = [];
      let lastSelection: HTMLElement[] = [];
      let x1 = hitPosX,y1 = hitPosY;
      
      let timer: any = null;
      let toLeft = false;
      let toTop = false;
      let toRight = false;
      let toBottom = false;

      //bind events
      onPointerStart(function (args: Record<string, any>) {
        const { ev } = args
        //update targets count & positions
        that.#_detector.update();

        //detect container position
        const pos = currentCStyle.position;

        if (pos === "static") {
          originPos = con.style.position;
          con.style.position = "relative";
        }
        //clear _lastSelected
        each(that.#_lastSelected, t => {
          target.classList.toggle(CLASS_SELECTED, false);
        })

        style.display = 'block'

        onStart && onStart({ selection: that.#_lastSelected, selectable: con }, ev);
      })
      onPointerMove((args: Record<string, any>) => {
        const { ev } = args

        //获取当前位置坐标
        const currentXy = getPointInContainer(ev, currentTarget, currentRect, currentCStyle, matrixInfo)

        let pointX = currentXy.x
        let pointY = currentXy.y
        let offX = pointX - hitPosX
        let offY = pointY - hitPosY

        //edge detect
        if (scroll) {
          const ltX = ev.clientX - currentRect.x;
          const ltY = ev.clientY - currentRect.y;
          const rbX = currentRect.x + currentRect.width - ev.clientX;
          const rbY = currentRect.y + currentRect.height - ev.clientY;

          toLeft = ltX < EDGE_THRESHOLD;
          toTop = ltY < EDGE_THRESHOLD;
          toRight = rbX < EDGE_THRESHOLD;
          toBottom = rbY < EDGE_THRESHOLD;

          if (toLeft || toTop || toRight || toBottom) {
            if (!timer) {
              timer = setInterval(() => {
                if (toLeft) {
                  con.scrollLeft -= scrollSpeed;
                } else if (toRight) {
                  con.scrollLeft += scrollSpeed;
                }
                if (toTop) {
                  con.scrollTop -= scrollSpeed;
                } else if (toBottom) {
                  con.scrollTop += scrollSpeed;
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

        let x = hitPosX,
          y = hitPosY,
          w = Math.abs(offX),
          h = Math.abs(offY);
        if (offX > 0 && offY > 0) {
          x1 = hitPosX;
          y1 = hitPosY;
        } else if (offX < 0 && offY < 0) {
          x = x1 = pointX;
          y = y1 = pointY;
        } else if (offX < 0) {
          x = x1 = pointX;
        } else if (offY < 0) {
          y = y1 = pointY;
        }

        style.width = w + "px";
        style.height = h + "px";

        style.transform = `translate3d(${x}px,${y}px,0)`

        //detect collision
        if (mode === "overlap") {
          selection = that.#_detector.getOverlaps(x1, y1, x1 + w, y1 + h);
        } else if (mode === "inclusion") {
          selection = that.#_detector.getInclusions(x1, y1, x1 + w, y1 + h);
        }

        each(lastSelection, (t) => {
          if (!includes(selection, t)) {
            t.classList.toggle(CLASS_SELECTING, false);
            each(selectingClassAry, (cls) => {
              t.classList.toggle(cls, false);
            });
          }
        });

        each(selection, (t) => {
          t.classList.toggle(CLASS_SELECTING, true);
          each(selectingClassAry, (cls) => {
            t.classList.toggle(cls, true);
          });
        });

        const changed = lastSelection.length != selection.length;

        lastSelection = selection;

        if (changed && onSelect) onSelect({ selection, selectable: con }, ev);
      })
      onPointerEnd((args: Record<string, any>) => {
        const { ev, currentStyle } = args

        style.display = 'none'
        
        if (scroll) {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
        //restore container position
        if (originPos) {
          con.style.position = originPos;
        }

        each(selection, (t) => {
          each(selectingClassAry, (cls) => {
            t.classList.toggle(cls, false);
          });
          each(selectedClassAry, (cls) => {
            t.classList.toggle(cls, true);
          });
          t.classList.toggle(CLASS_SELECTING, false);
          t.classList.toggle(CLASS_SELECTED, true);
        });

        that.#_lastSelected = selection;

        if (onEnd) onEnd({ selection, selectable: con }, ev);
      })
    }, {
      threshold: THRESHOLD,
      lockPage: true
    })
  }

  /**
   * @internal
   */
  onOptionChanged() {
    this.updateTargets();
  }
}

/**
 * Add a selector into the container
 * @param container css selector or html element
 * @param opts
 * @returns 
 */
export function newSelectable(
  container: string | HTMLElement,
  opts?: SelectableOptions
): Selectable {
  return new Selectable(container, opts);
}

/* eslint-disable max-len */
/**
 * selector
 * @author holyhigh2
 */

import {
  assign,
  call,
  compact,
  each,
  includes,
  isFunction,
  some,
  split,
} from "@holyhigh/func.js";
import { CollisionDetector, newCollisionDetector } from "./detector";
import { SelectableOptions, Uii } from "./types";
import { EDGE_THRESHOLD, getOffset } from "./utils";

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
    const selector = document.createElement("div");
    selector.className = CLASS_SELECTOR;
    selector.style.cssText = `
      position:absolute;
      left:-9999px;
    `;
    if (this.opts.class) {
      selector.className += " " + this.opts.class;
    } else {
      selector.style.cssText += "border:1px dashed #000;";
    }
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

    this.registerEvent(con, "mousedown", (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      const onStart = that.opts.onStart;
      const onSelect = that.opts.onSelect;
      const onEnd = that.opts.onEnd;
      const mode = that.opts.mode || "overlap";
      const scroll = that.opts.scroll;
      const scrollSpeed = that.opts.scrollSpeed || 10;
      const filter = that.opts.filter;
      const selectingClassAry = compact(split(that.opts.selectingClass, " "));
      const selectedClassAry = compact(split(that.opts.selectedClass, " "));

      //check filter
      if (filter) {
        if (isFunction(filter)) {
          if (filter(t)) return;
        } else if (some(con.querySelectorAll(filter), (el) => el.contains(t)))
          return;
      }

      let originPos = "";

      //offset
      const rect = con.getBoundingClientRect();
      const conStyle = window.getComputedStyle(con)
      const blw = parseFloat(conStyle.borderLeftWidth)
      const btw = parseFloat(conStyle.borderTopWidth)

      let hitPosX = e.offsetX + con.scrollLeft,
        hitPosY = e.offsetY + con.scrollTop;
      if (t !== con) {
        const offset = getOffset(t, con);
        const style = window.getComputedStyle(t)
        hitPosX = offset.x + e.offsetX + parseFloat(style.borderLeftWidth);
        hitPosY = offset.y + e.offsetY + parseFloat(style.borderTopWidth);
      }

      const style = selector.style;

      let selection: HTMLElement[] = [];
      let lastSelection: HTMLElement[] = [];
      let x1 = hitPosX,
        y1 = hitPosY;

      let dragging = false;
      let timer: any = null;
      let toLeft = false;
      let toTop = false;
      let toRight = false;
      let toBottom = false;
      const dragListener = (ev: MouseEvent) => {
        const newX = ev.clientX - rect.x + con.scrollLeft - blw;
        const newY = ev.clientY - rect.y + con.scrollTop -btw;

        const offsetx = newX - hitPosX;
        const offsety = newY - hitPosY;

        if (!dragging) {
          if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
            dragging = true;
            //update targets count & positions
            this.#_detector.update();

            //detect container position
            const pos = window.getComputedStyle(con).position;
            
            if (pos === "static") {
              originPos = con.style.position;
              con.style.position = "relative";
            }
            //clear _lastSelected
            each(this.#_lastSelected,t=>{
              t.classList.toggle(CLASS_SELECTED, false);
            })

            call(onStart,t as HTMLElement);
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
          w = Math.abs(offsetx),
          h = Math.abs(offsety);
        if (offsetx > 0 && offsety > 0) {
          x1 = hitPosX;
          y1 = hitPosY;
        } else if (offsetx < 0 && offsety < 0) {
          x = x1 = newX;
          y = y1 = newY;
        } else if (offsetx < 0) {
          x = x1 = newX;
        } else if (offsety < 0) {
          y = y1 = newY;
        }

        style.left = x + "px";
        style.top = y + "px";
        style.width = w + "px";
        style.height = h + "px";

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

        if (changed) call(onSelect,selection);

        ev.preventDefault();
        return false;
      };

      const dragEndListener = (ev: MouseEvent) => {
        style.left = "-9999px";
        style.width = style.height = "0px";
        document.removeEventListener("mousemove", dragListener, false);
        document.removeEventListener("mouseup", dragEndListener, false);
        window.removeEventListener("blur", dragEndListener, false);

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

        this.#_lastSelected = selection;

        if (dragging) call(onEnd,selection);
      };

      document.addEventListener("mousemove", dragListener, false);
      document.addEventListener("mouseup", dragEndListener, false);
      window.addEventListener("blur", dragEndListener, false);

      e.preventDefault();
      return false;
    });
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

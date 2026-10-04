/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * 拖动器
 * @author holyhigh2
 */
import { assign, each, isFunction, isString, split, test, toArray } from 'myfx';
import { Uii } from "./types";
import type { DroppableOptions } from "./types"
import { setCursor } from "./utils";

const Droppables: Array<Droppable> = []
const CLASS_DROPPABLE = "uii-droppable";

/**
 * 用于表示一个或多个可响应拖动元素的定义
 * > 可用CSS接口
 * - .uii-droppable
 * @public
 */
export class Droppable extends Uii {
  private __active: HTMLElement | null
  private __boundEls = new WeakSet<HTMLElement>()

  constructor(
    el: string | HTMLElement | Array<string | HTMLElement> | NodeListOf<Element>,
    opts?: DroppableOptions
  ) {
    super(
      el,
      assign(
        {
          watch: true
        },
        opts
      )
    );

    Droppables.push(this)
  }

  /**
   * @internal
   */
  bindEvent(
    droppable: HTMLElement,
    opts: DroppableOptions
  ) {
    //dragenter
    this.registerEvent(droppable, "mouseenter", (e: MouseEvent) => {
      if (!this.__active) return
      if (this.__active === droppable) return

      if (opts.hoverClass) {
        each(split(opts.hoverClass, ' '), cls => {
          droppable.classList.toggle(cls, true)
        })
      }

      if (this.__active.dataset.cursorOver) {
        setCursor(this.__active.dataset.cursorOver)
      }

      opts.onEnter && opts.onEnter({ draggable: this.__active, droppable }, e)
    })
    //dragleave
    this.registerEvent(droppable, "mouseleave", (e: MouseEvent) => {
      if (!this.__active) return
      if (this.__active === droppable) return

      if (opts.hoverClass) {
        each(split(opts.hoverClass, ' '), cls => {
          droppable.classList.toggle(cls, false)
        })
      }

      if (this.__active.dataset.cursorOver) {
        setCursor(this.__active.dataset.cursorActive || '')
      }

      opts.onLeave && opts.onLeave({ draggable: this.__active, droppable }, e)
    })
    //dragover
    this.registerEvent(droppable, "mousemove", (e: MouseEvent) => {
      if (!this.__active) return
      if (this.__active === droppable) return

      opts.onOver && opts.onOver({ draggable: this.__active, droppable }, e)
    })
    //drop
    this.registerEvent(droppable, "mouseup", (e: MouseEvent) => {
      if (!this.__active) return
      if (this.__active === droppable) return

      if (opts.hoverClass) {
        each(split(opts.hoverClass, ' '), cls => {
          droppable.classList.toggle(cls, false)
        })
      }

      opts.onDrop && opts.onDrop({ draggable: this.__active, droppable }, e)
    })
  }

  /**
   * @internal
   */
  active(target: HTMLElement) {
    let valid = true
    const opts: DroppableOptions = this.opts

    if (opts.watch && this.eleString) {
      let nodes = document.querySelectorAll(this.eleString)
      this.ele = toArray<HTMLElement>(nodes)
    }

    //check accepts
    if (isString(opts.accepts)) {
      valid = !!target.dataset.dropType && test(opts.accepts, target.dataset.dropType)
    } else if (isFunction(opts.accepts)) {
      valid = opts.accepts(this.ele, target)
    }
    if (!valid) return

    this.__active = target

    if (opts.activeClass) {
      each(this.ele, el => {
        each(split(opts.activeClass || '', ' '), cls => {
          el.classList.toggle(cls, true)
        })
      })
    }

    opts.onActive && opts.onActive({ draggable: target, droppables: this.ele })

    //bind events
    each(this.ele, (el) => {
      el.classList.toggle(CLASS_DROPPABLE, true)
      el.style.pointerEvents = 'initial';
      // 防止重复绑定：deactive 依赖 dragdeactive 事件冒泡，当拖动源已从
      // 文档树移除时该事件无法冒泡到 document，destroy 不会执行，
      // 此时重复 active() 会叠加 mouseup 等监听导致 onDrop 多次触发
      if (this.__boundEls.has(el)) return
      this.__boundEls.add(el)
      this.bindEvent(el, opts);
    });
  }
  /**
   * @internal
   */
  deactive(target: HTMLElement) {
    if (!this.__active) return

    this.__active = null
    const opts: DroppableOptions = this.opts

    if (opts.activeClass) {
      each(this.ele, el => {
        each(split(opts.activeClass || '', ' '), cls => {
          el.classList.toggle(cls, false)
        })
      })
    }

    opts.onDeactive && opts.onDeactive({ draggable: target, droppables: this.ele })

    //unbind events
    this.destroy()
  }
}

//uii-drag active
document.addEventListener("uii-dragactive", (e: CustomEvent) => {
  let { target } = e.detail
  each(Droppables, dpb => {
    dpb.active(target as HTMLElement)
  })
})
document.addEventListener("uii-dragdeactive", (e: CustomEvent) => {
  let { target } = e.detail
  each(Droppables, dpb => {
    dpb.deactive(target as HTMLElement)
  })
})

/**
 * Enable els to response to draggable objects
 * @param els selector string / html element
 * @param opts 
 * @returns 
 */
export function newDroppable(
  els: string | HTMLElement | Array<string | HTMLElement> | NodeListOf<Element>,
  opts?: DroppableOptions
): Droppable {
  return new Droppable(els, opts);
}

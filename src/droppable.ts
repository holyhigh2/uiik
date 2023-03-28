/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * 拖动器
 * @author holyhigh2
 */
import {
  each,
  assign,
  isString,
  test,
  isFunction,
  split,
  call
} from "@holyhigh/func.js";
import { DroppableOptions, Uii } from "./types";
import { setCursor } from "./utils";

const Droppables:Array<Droppable> = []
const CLASS_DROPPABLE = "uii-droppable";

/**
 * 用于表示一个或多个可响应拖动元素的定义
 * > 可用CSS接口
 * - .uii-droppable
 * @public
 */
export class Droppable extends Uii {
  #active:HTMLElement|null
  
  constructor(
    el: string | HTMLElement | Array<string | HTMLElement>,
    opts?: DroppableOptions
  ) {
    super(
      el,
      assign(
        {
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
    el: HTMLElement,
    opts: Record<string, any>
  ) {
    //dragenter
    this.registerEvent(el, "mouseenter", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          el.classList.toggle(cls,true)
        })
      }

      if(this.#active.dataset.cursorOver){
        setCursor(this.#active.dataset.cursorOver)
      }

      call(opts.onEnter,el,e)
    })
    //dragleave
    this.registerEvent(el, "mouseleave", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          el.classList.toggle(cls,false)
        })
      }

      if(this.#active.dataset.cursorOver){
        setCursor(this.#active.dataset.cursorActive || '')
      }

      call(opts.onLeave,el,e)
    })
    //dragover
    this.registerEvent(el, "mousemove", (e: MouseEvent) => {
      if(!this.#active)return
      if(opts.onDragOver){
        opts.onDragOver(el,e)
      }
    })
    //drop
    this.registerEvent(el, "mouseup", (e: MouseEvent) => {
      if(!this.#active)return

      if(opts.hoverClass){
        each(split(opts.hoverClass,' '),cls=>{
          el.classList.toggle(cls,false)
        })
      }
      
      call(opts.onDrop,el,e)
    })
  }

  /**
   * @internal
   */
  active(target:HTMLElement){
    let valid = true
    //check accepts
    if(isString(this.opts.accepts)){
      valid = !!target.dataset.dropType && test(this.opts.accepts,target.dataset.dropType)
    }else if(isFunction(this.opts.accepts)){
      valid =  this.opts.accepts(this.ele,target)
    }
    if(!valid)return

    this.#active = target

    if(this.opts.activeClass){
      each(this.ele,el=>{
        each(split(this.opts.activeClass,' '),cls=>{
          el.classList.toggle(cls,true)
        })
      })
    }

    call(this.opts.onActive,target,this.ele)

    //bind events
    each(this.ele, (el) => {
      el.classList.toggle(CLASS_DROPPABLE,true)
      el.style.pointerEvents = 'initial';
      this.bindEvent(el, this.opts);
    });
  }
  /**
   * @internal
   */
  deactive(target:HTMLElement){
    if(!this.#active)return

    this.#active = null

    if(this.opts.activeClass){
      each(this.ele,el=>{
        each(split(this.opts.activeClass,' '),cls=>{
          el.classList.toggle(cls,false)
        })
      })
    }

    call(this.opts.onDeactive,target,this.ele)

    //unbind events
    this.destroy()
  }
}

//uii-drag active
document.addEventListener("uii-dragactive", (e: MouseEvent) => {
  each(Droppables,dpb=>{
    dpb.active(e.target as HTMLElement)
  })
})
document.addEventListener("uii-dragdeactive", (e: MouseEvent) => {
  each(Droppables,dpb=>{
    dpb.deactive(e.target as HTMLElement)
  })
})

/**
 * Enable els to response to draggable objects
 * @param els selector string / html element
 * @param opts 
 * @returns 
 */
export function newDroppable(
  els: string | HTMLElement | Array<string | HTMLElement>,
  opts?: DroppableOptions
): Droppable {
  return new Droppable(els, opts);
}

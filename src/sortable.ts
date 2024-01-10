/* eslint-disable max-len */
/**
 * sortable
 * @author holyhigh2
 */
import {each,map,flatMap,reject,size,toArray} from 'myfx/collection'
import {alphaId} from 'myfx/utils'
import {merge} from 'myfx/object'
import {compact,findIndex} from 'myfx/array'
import {split} from 'myfx/string'
import {isEmpty,isFunction} from 'myfx/is'

import { SortableOptions, Uii } from "./types";
import { THRESHOLD, lockPage, restoreCursor, saveCursor, unlockPage } from "./utils";

const SORTABLE_GROUPS: Record<string, Array<[Sortable, HTMLElement[]]>> = {};
const CLASS_SORTABLE_CONTAINER = "uii-sortable-container";
const CLASS_SORTABLE_GHOST = "uii-sortable-ghost";
const CLASS_SORTABLE_ACTIVE = "uii-sortable-active";

const ATTR_SORTABLE_ACTIVE = "uii-sortable-active";

/**
 * 用于表示一类排序容器的定义
 * > 可用CSS接口
 * - .uii-sortable-container
 * - .uii-sortable-ghost
 * - .uii-sortable-active
 * @public
 */
export class Sortable extends Uii {
  #removeListenItems: any[];
  constructor(
    container: string | HTMLElement | Array<HTMLElement>,
    opts?: SortableOptions
  ) {
    super(
      container,
      merge(
        {
          move: {
            from: true,
            to: true,
          },
          scroll: true,
          sort:true
        },
        opts
      )
    );

    if (size(this.ele) > 1 && !this.opts.group) {
      this.opts.group = "uii_sortable_" + alphaId();
    }

    each(this.ele, (el) => {
      el.classList.add(CLASS_SORTABLE_CONTAINER);
      el.style.position = "relative";
      el.style.pointerEvents = "initial";
      bindContainer(this.registerEvent.bind(this), el, this.opts);
    });

    //put into group
    if (this.opts.group) {
      if (!SORTABLE_GROUPS[this.opts.group]) {
        SORTABLE_GROUPS[this.opts.group] = [];
      }
      SORTABLE_GROUPS[this.opts.group].push([this, this.ele]);
    }
  }

  /**
   * 调用active表示移出策略肯定是true | 'copy'
   * @internal
   */
  active(
    draggingItem: HTMLElement,
    fromContainer: HTMLElement,
    toContainers: HTMLElement[],
    toOpts: SortableOptions
  ) {
    //check move
    const moveFrom = toOpts.move?.from;
    const acceptFn = isFunction(moveFrom) ? moveFrom : () => !!moveFrom;

    //验证移入策略
    const activableContainers = flatMap(toContainers, (el) => {
      const valid = acceptFn(draggingItem, fromContainer, el);
      return valid ? el : [];
    });

    each(activableContainers, (el) => {
      el.setAttribute(ATTR_SORTABLE_ACTIVE, "1");
      if (toOpts.activeClass) {
        each(split(toOpts.activeClass || "", " "), (cls) => {
          el.classList.toggle(cls, true);
        });
      }
    });

    this.#removeListenItems = map(activableContainers, (con) => {
      const filteredItems = con.querySelectorAll(":scope > *");
      return listenItems(toOpts, con, draggingItem, filteredItems);
    });

    toOpts.onActive &&
      toOpts.onActive({ item: draggingItem, from: fromContainer });
  }
  /**
   * @internal
   */
  deactive(
    draggingItem: HTMLElement,
    fromContainer: HTMLElement,
    toContainers: HTMLElement[],
    opts: SortableOptions
  ) {
    each(toContainers, (el) => {
      el.removeAttribute(ATTR_SORTABLE_ACTIVE);
      if (opts.activeClass) {
        each(split(opts.activeClass || "", " "), (cls) => {
          el.classList.toggle(cls, false);
        });
      }
    });

    each(this.#removeListenItems, (fn) => {
      fn();
    });

    opts.onDeactive &&
      opts.onDeactive({ item: draggingItem, from: fromContainer });
  }

  /**
   * @internal
   */
  onOptionChanged() {}
}

let DraggingData: {
  item: HTMLElement;
  fromContainer: HTMLElement;
  fromIndex: number
  toContainer?: HTMLElement;
  moveTo: boolean | "copy";
  copy?: HTMLElement;
  spill?: string
} | null = null;

function bindContainer(
  registerEvent: Function,
  container: HTMLElement,
  opts: SortableOptions
) {
  registerEvent(container, "mousedown", (e: MouseEvent) => {
    let con = e.currentTarget as HTMLElement;
    let t = e.target as HTMLElement;
    if (t === con) return;

    // filter & handle
    const filterStr = opts.filter ? `:not(${opts.filter})` : "";
    const filteredItems = con.querySelectorAll(":scope > *" + filterStr);
    const handles = opts.handle
      ? map(filteredItems, (el) => el.querySelector(opts.handle || ""))
      : toArray(filteredItems);

    const i = findIndex<any>(handles, (handle) => handle.contains(t));
    if (i < 0) return;

    const draggingItem = filteredItems[i] as HTMLElement;
    const ghostContainer = opts.ghostContainer || con;

    const onStart = opts.onStart;
    const onEnd = opts.onEnd;
    const ghostClass = opts.ghostClass;
    const group = opts.group;
    let moveTo = opts.move?.to;
    const toCopy = moveTo === "copy";
    const toOutFn = isFunction(moveTo) ? moveTo : () => !!moveTo;
    const moveMode = toOutFn(draggingItem, con);
    const sort = opts.sort

    const scroll = opts.scroll;
    const scrollSpeed = opts.scrollSpeed || 10;

    let hitPosX = e.offsetX + con.scrollLeft,
      hitPosY = e.offsetY + con.scrollTop;

    saveCursor();

    let dragging = false;
    let ghostNode: HTMLElement | null = null;
    let removeListenItems:(() => void)|null = null

    const dragListener = (ev: MouseEvent) => {
      const newX = ev.clientX;
      const newY = ev.clientY;

      let offsetx = newX - hitPosX;
      let offsety = newY - hitPosY;

      if (!dragging) {
        if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
          dragging = true;

          ghostNode = draggingItem.cloneNode(true) as HTMLElement;
          ghostNode.style.opacity = "0.3";
          ghostNode.style.pointerEvents = "none";
          ghostNode.style.position = "fixed";
          ghostNode.style.zIndex = "999";

          ghostNode.style.left = draggingItem.style.left;
          ghostNode.style.top = draggingItem.style.top;

          if (ghostClass) {
            ghostNode.classList.add(...compact(split(ghostClass, " ")));
          }
          ghostNode.classList.toggle(CLASS_SORTABLE_GHOST, true);
          ghostContainer.appendChild(ghostNode);

          if(!toCopy)
            draggingItem.classList.toggle(CLASS_SORTABLE_ACTIVE, true);
          let copy:HTMLElement|undefined = undefined
          if(toCopy){
            copy = draggingItem.cloneNode(true) as HTMLElement
            copy.classList.toggle(CLASS_SORTABLE_ACTIVE, true);
          }
          DraggingData = {
            item: draggingItem,
            fromIndex: i,
            fromContainer: con,
            toContainer:con,
            moveTo: toCopy ? "copy" : moveMode,
            spill: opts.spill,
            copy
          };

          onStart && onStart({ item: draggingItem, from: con, index: i }, ev);

          lockPage();

          if(sort){
            removeListenItems = listenItems(
              opts,
              con,
              toCopy?draggingItem:copy!,
              filteredItems,
              i
            );
          }
          
          //active
          if (moveMode && group && SORTABLE_GROUPS[group]) {
            each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
              const filtered = reject(ele, (el) => el === container);
              if (isEmpty(filtered)) return;
              sortable.active(
                toCopy?draggingItem:copy!,
                container,
                filtered,
                sortable.getOptions()
              );
            });
          }
        } else {
          ev.preventDefault();
          return false;
        }
      }

      ghostNode!.style.left = newX + "px";
      ghostNode!.style.top = newY + "px";

      ev.preventDefault();
      return false;
    };
    const dragEndListener = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", dragListener);
      document.removeEventListener("mouseup", dragEndListener);
      window.removeEventListener("blur", dragEndListener);

      if (dragging) {
        unlockPage();
        restoreCursor();
        if (ghostNode) ghostContainer.removeChild(ghostNode);

        const toContainer = DraggingData?.toContainer

        DraggingData?.item.classList.remove(CLASS_SORTABLE_ACTIVE);
        DraggingData?.copy?.classList.remove(CLASS_SORTABLE_ACTIVE);

        DraggingData = null;

      if(removeListenItems)
        removeListenItems();

        //deactive
        if (group && SORTABLE_GROUPS[group]) {
          each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
            const filtered = reject(ele, (el) => el === container);
            if (isEmpty(filtered)) return;
            sortable.deactive(
              draggingItem,
              container,
              filtered,
              sortable.getOptions()
            );
          });
        }

        onEnd && onEnd({ item: draggingItem, from: container,to:toContainer! }, e);
      }
      
    };

    document.addEventListener("mousemove", dragListener);
    document.addEventListener("mouseup", dragEndListener);
    window.addEventListener("blur", dragEndListener);

    e.preventDefault();
    return false;
  });

  registerEvent(container, "mouseleave", (e: MouseEvent) => {
    if (!DraggingData) return;

    opts.onLeave &&
      opts.onLeave(
        {
          item: DraggingData.item,
          from: DraggingData.fromContainer,
          to: container,
        },
        e
      );
    
    if(DraggingData.moveTo !== 'copy'){
      if(DraggingData.spill === 'remove'){
        DraggingData.item.parentElement?.removeChild(DraggingData.item)
      }else if(DraggingData.spill === 'revert'){
        DraggingData.item.parentElement?.removeChild(DraggingData.item)
        const nextSibling = DraggingData.fromContainer.children[DraggingData.fromIndex]
        DraggingData.fromContainer.insertBefore(DraggingData.item,nextSibling)
      }
    }
    
  });

  //总是先触发容器enter，之后才是itementer
  registerEvent(container, "mouseenter", (e: MouseEvent) => {
    if (!DraggingData) return;

    let draggingItem = DraggingData.item;
    let parent = draggingItem.parentElement;

    const cx = e.clientX;
    const cy = e.clientY;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = cx - rect.x;
    const offsetY = cy - rect.y;

    let dir = "";
    if (offsetX < centerX && offsetY < centerY) {
      dir = "tl";
    } else if (offsetX > centerX && offsetY > centerY) {
      dir = "br";
    } else if (offsetX < centerX && offsetY > centerY) {
      dir = "bl";
    } else if (offsetX > centerX && offsetY < centerY) {
      dir = "tr";
    }

    opts.onEnter &&
      opts.onEnter(
        {
          item: DraggingData.item,
          from: DraggingData.fromContainer,
          to: container,
          dir,
        },
        e
      );

    DraggingData.toContainer = container;

    if (container.getAttribute(ATTR_SORTABLE_ACTIVE)) {
      let valid = true;
      //check move
      const moveFrom = opts.move?.from;
      const acceptFn = isFunction(moveFrom) ? moveFrom : () => !!moveFrom;
      valid = acceptFn(
        DraggingData.item,
        DraggingData.fromContainer,
        container
      );
      if (!valid) return;

      if (container.contains(draggingItem)) {
        return;
      }

      //此处检测移出策略
      const moveTo = DraggingData.moveTo;
      if (moveTo === "copy") {
        draggingItem = DraggingData.copy!
      }

      if(draggingItem.parentElement)
        draggingItem.parentElement.removeChild(draggingItem);
      let toIndex = 0;
      if (dir[0] === "t") {
        container.insertBefore(draggingItem, container.children[0]);
      } else {
        container.appendChild(draggingItem);
        toIndex = container.children.length - 1;
      }
      opts.onAdd &&
        opts.onAdd(
          {
            item: draggingItem,
            from: DraggingData.fromContainer,
            to: container,
            index:toIndex,
          },
          e
        );
    } else if (container === DraggingData.fromContainer) {
      if (DraggingData.copy) { 
        let parent = DraggingData.copy.parentElement;
        if (parent) parent.removeChild(DraggingData?.copy);
      }else{
        if(draggingItem.parentElement)
          draggingItem.parentElement.removeChild(draggingItem);
        let toIndex = 0;
        if (dir[0] === "t") {
          container.insertBefore(draggingItem, container.children[0]);
        } else {
          container.appendChild(draggingItem);
          toIndex = container.children.length - 1;
        }
      }
    }
  });
}

function listenItems(
  opts: SortableOptions,
  toContainer: HTMLElement,
  draggingItem: HTMLElement,
  items: NodeListOf<Element>,
  fromIndex = 0
): () => void {
  //sorting listener
  const listener = (e: MouseEvent) => {
    const ct = e.currentTarget as HTMLElement;

    if (ct.style.transform) {
      return;
    }
    const toIndex = (ct as any)._uiik_i;

    let draggingItem = DraggingData?.copy || DraggingData?.item!
    if(toContainer === DraggingData?.fromContainer){
      draggingItem = DraggingData?.item
    }

    let parent = draggingItem.parentElement;

    parent?.removeChild(draggingItem);

    const sameContainer = parent === ct.parentElement;
    if (!sameContainer) {
      parent = ct.parentElement;
    }

    const oldIndex = fromIndex;
    if (toIndex > fromIndex) {
      fromIndex = toIndex;
      parent?.insertBefore(draggingItem, ct.nextElementSibling);
    } else {
      fromIndex = toIndex - 1;
      parent?.insertBefore(draggingItem, ct);
    }

    opts.onChange &&
      opts.onChange(
        {
          item: draggingItem,
          from: DraggingData?.fromContainer!,
          to: toContainer,
          fromIndex: oldIndex,
          toIndex: fromIndex,
        },
        e
      );

    const toPos = { x: ct.offsetLeft, y: ct.offsetTop };
    const fromPos = { x: draggingItem.offsetLeft, y: draggingItem.offsetTop };

    ct.style.transform = `translate3d(${fromPos.x - toPos.x}px,${
      fromPos.y - toPos.y
    }px,0)`;
    draggingItem.style.transform = `translate3d(${toPos.x - fromPos.x}px,${
      toPos.y - fromPos.y
    }px,0)`;

    draggingItem.offsetHeight;
    ct.offsetHeight;

    draggingItem.style.transition = "transform .15s";
    draggingItem.style.transform = `translate3d(0px,0px,0)`;

    ct.style.transition = "transform .15s";
    ct.style.transform = `translate3d(0px,0px,0)`;

    setTimeout(() => {
      ct.style.transition = "";
      ct.style.transform = ``;

      draggingItem.style.transition = "";
      draggingItem.style.transform = ``;
    }, 150);

    e.stopPropagation();
    e.preventDefault();
  };

  each<HTMLElement>(items, (item, i) => {
    item.style.position = "relative";
    if (item === draggingItem) return;

    item.style.pointerEvents = "initial";
    (item as any)._uiik_i = i;
    item.addEventListener("mouseenter", listener);
  });

  return () => {
    //解绑enter事件
    each<HTMLElement>(items, (item, i) => {
      if (item === draggingItem) return;
      item.removeEventListener("mouseenter", listener);
    });
  };
}

/**
 * make elements within the container sortable
 * @param container css selector or html element（array)
 * @param opts
 * @returns
 */
export function newSortable(
  container: string | HTMLElement | Array<HTMLElement>,
  opts?: SortableOptions
): Sortable {
  return new Sortable(container, opts);
}

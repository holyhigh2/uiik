import { isElement, isString, isArrayLike, isEmpty } from "myfx/is";
import { each, map, toArray } from "myfx/collection";
import { assign, get } from "myfx/object";
import {
  getMatrixInfo,
  lockPage,
  restoreCursor,
  saveCursor,
  setCursor,
  unlockPage,
} from "./utils";
import { UiiTransform } from "./transform";

/**
 * A Base class for all Uii classes
 */
export abstract class Uii {
  /**
   * 处理过的dom元素数组
   */
  protected ele: Array<HTMLElement>;
  /**
   * 当前uii对象的选项
   */
  opts: Record<string, any>;
  protected enabled: boolean = true;
  #listeners: Array<[Element, string, Function, boolean]> = [];
  protected eleString: string;

  constructor(
    ele: string | Element | NodeList | HTMLCollection | Array<string | Element>,
    opts?: Record<string, any>
  ) {
    this.opts = opts || {};
    this.opts.mouseButton = this.opts.mouseButton||'left'

    if (isArrayLike(ele) && !isString(ele)) {
      this.ele = map<HTMLElement>(ele, (el) => {
        let e = isString(el) ? document.querySelector(el) : el;
        if (!isElement(e)) {
          console.error('Invalid element "' + el + '"');
          return false;
        }
        return e;
      });
    } else {
      if (isString(ele)) {
        this.eleString = ele;
      }
      const el = isString(ele) ? document.querySelectorAll(ele) : ele;
      if (!isElement(el) && !isArrayLike(el)) {
        console.error('Invalid element "' + ele + '"');
        return;
      }
      this.ele = isArrayLike(el)
        ? toArray<HTMLElement>(el)
        : [el as HTMLElement];
    }
  }

  /**
   * 销毁uii对象，包括卸载事件、清空元素等
   */
  destroy(): void {
    each(this.#listeners, (ev) => {
      ev[0].removeEventListener(ev[1], ev[2] as any, ev[3]);
    });
    this.#listeners = [];
  }

  //通用指针事件处理接口
  addPointerDown(
    el: Element,
    pointerDown: (args: Record<string, any>) => void | boolean,
    opts: {
      threshold?: number;
      lockPage?: boolean;
    }
  ) {
    const onPointerDown = pointerDown;
    const threshold = opts.threshold || 0;
    const toLockPage = opts.lockPage || false;

    const uiiOptions = this.opts;

    this.registerEvent(
      el,
      "mousedown",
      (e: PointerEvent) => {
        if (uiiOptions.mouseButton) {
          switch (uiiOptions.mouseButton) {
            case "left":
              if (e.button != 0) return;
              break;
            case "right":
              if (e.button != 2) return;
              break;
          }
        }

        let t = e.target as HTMLElement;
        if (!t) return;

        //uiik options
        const hasCursor = !isEmpty(get(uiiOptions, "cursor.active"));

        //提取通用信息
        const currentStyle = (el as HTMLStyleElement).style;
        const currentCStyle = window.getComputedStyle(el);
        const currentRect = el.getBoundingClientRect();

        let dragging = false;
        const originPosX = e.clientX;
        const originPosY = e.clientY;

        if (hasCursor) {
          saveCursor();
        }

        let onPointerStart: Function;
        let onPointerMove: Function;
        let onPointerEnd: Function;

        const toBreak = !!onPointerDown({
          onPointerMove: (pm: (args: Record<string, any>) => void) => {
            onPointerMove = pm;
          },
          onPointerStart: (ps: (args: Record<string, any>) => void) => {
            onPointerStart = ps;
          },
          onPointerEnd: (pe: (args: Record<string, any>) => void) => {
            onPointerEnd = pe;
          },
          ev: e,
          pointX: e.clientX,
          pointY: e.clientY,
          target: t,
          currentTarget: el,
          currentStyle,
          currentCStyle,
          currentRect,
        });
        if (toBreak) {
          e.preventDefault();
          return false;
        }

        let matrixInfo = getMatrixInfo(el as any,true)

        //函数
        const pointerMove = (ev: MouseEvent) => {
          const offX = (ev.clientX - originPosX) / matrixInfo.scale;
          const offY = (ev.clientY - originPosY) / matrixInfo.scale;

          if (!dragging) {
            if (Math.abs(offX) > threshold || Math.abs(offY) > threshold) {
              dragging = true;

              if (toLockPage) {
                lockPage();
              }

              if (hasCursor) {
                setCursor(uiiOptions.cursor.active);
              }

              onPointerStart && onPointerStart({ ev });
            } else {
              ev.preventDefault();
              return false;
            }
          }

          onPointerMove &&
            onPointerMove({
              ev,
              pointX: ev.clientX,
              pointY: ev.clientY,
              offX,
              offY,
              currentStyle,
              currentCStyle,
            });
        };
        const pointerEnd = (ev: MouseEvent) => {
          document.removeEventListener("mousemove", pointerMove, false);
          document.removeEventListener("mouseup", pointerEnd, false);
          window.removeEventListener("blur", pointerEnd, false);

          if (dragging) {
            if (toLockPage) {
              unlockPage();
            }
            if (hasCursor) {
              restoreCursor();
            }

            onPointerEnd && onPointerEnd({ ev, currentStyle });
          }
        };

        document.addEventListener("mousemove", pointerMove);
        document.addEventListener("mouseup", pointerEnd);
        window.addEventListener("blur", pointerEnd);

        e.preventDefault();
        return false;
      },
      true
    );
  }

  /**
   * 注册事件，以便在{@link destroy}方法中卸载
   * @param el dom元素
   * @param event 事件名
   * @param hook 回调函数
   * @param useCapture 默认false
   */
  registerEvent(
    el: Element,
    event: string,
    hook: Function,
    useCapture: boolean = false
  ) {
    const wrapper = ((ev: MouseEvent) => {
      if (!this.enabled) return;

      hook(ev);
    }).bind(this);
    el.addEventListener(event, wrapper, useCapture);
    this.#listeners.push([el, event, wrapper, useCapture]);
  }
  /**
   * 禁用uii实例，禁用后的dom不会响应事件
   */
  disable(): void {
    this.enabled = false;
  }
  /**
   * 启用uii实例
   */
  enable(): void {
    this.enabled = true;
  }
  /**
   * 获取uii实例选项对象
   */
  getOptions(): Record<string, any> {
    return this.opts;
  }
  /**
   * 获取指定名称的选项值
   * @param name
   * @returns
   */
  getOption(name: string): any {
    return this.opts[name];
  }
  /**
   * 设置多个选项值。触发`onOptionChanged`
   * @param options
   */
  setOptions(options?: Record<string, any>): void {
    assign(this.opts, options);
    this.onOptionChanged(this.opts);
  }
  /**
   * 设置指定name的选项值。触发`onOptionChanged`
   * @param name
   * @param value
   */
  setOption(name: string, value: any): void {
    this.opts[name] = value;
    this.onOptionChanged(this.opts);
  }

  /**
   * @internal
   */
  protected onOptionChanged(opts?: Record<string, any>): void {}
}

export type ResizableOptions = {
  /**
   * 控制器元素选择器(1-n个元素)，如果为空表示点击任意元素即可触发
   */
  handle?:
    | ((
        target: HTMLElement | SVGGraphicsElement
      ) =>
        | NodeList
        | HTMLCollection
        | HTMLElement[]
        | HTMLElement
        | SVGGraphicsElement)
    | string
    | NodeList
    | HTMLCollection
    | HTMLElement[]
    | HTMLElement
    | SVGGraphicsElement;
  /**
   * 拖动元素的最小size，如果是数组，表示 [width,height]
   */
  minSize?: number | Array<number>;
  /**
   * 拖动元素的最大size，如果是数组，表示 [width,height]
   */
  maxSize?: number | Array<number>;
  /**
   * resizable方向，默认[n,s,e,w,ne,nw,se,sw]
   */
  dir?: string[];
  /**
   * 宽高比，小数
   */
  aspectRatio?: number;
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁并且元素移动到最后位置。默认false
   */
  ghost?: boolean | Function;
  ghostClass?: string;
  //相对于图形左上角的圆心偏移，支持数字/百分比
  //仅对SVG元素有效，对于非SVG元素使用transform-origin属性
  ox?: number | string;
  oy?: number | string;
  /**
   * 指针点击时触发，可用于阻止后续逻辑
   * @param event
   * @returns 返回false则停止后续逻辑
   */
  onPointerDown?: (event: MouseEvent) => boolean;
  onStart?: (
    data: { w: number; h: number; transform: UiiTransform },
    event: MouseEvent
  ) => void;
  onResize?: (
    data: {
      w: number;
      h: number;
      ow: number;
      oh: number;
      target: HTMLElement | SVGGraphicsElement;
      vertex: Array<{ x: number; y: number }>;
      transform: UiiTransform;
    },
    event: MouseEvent
  ) => void;
  onEnd?: (
    data: { w: number; h: number; transform: UiiTransform },
    event: MouseEvent
  ) => void;
  onClone?: (data: { clone: HTMLElement }, event: MouseEvent) => void;
};

export type SplittableOptions = {
  /**
   * handle宽/高，默认10
   */
  handleSize?: number;
  /**
   * 最小区域，如果是数组可以按顺序定义分割区域，默认0
   */
  minSize?: number | number[];
  /**
   * 单边模式，只修改单侧元素size，用于flex布局。可选值为 start/end
   */
  oneSideMode?: "start" | "end";
  /**
   * 粘性吸附，如果是数组可以按顺序定义分割区域。设置minSize后生效
   */
  sticky?: boolean | boolean[];
  /**
   * 自动创建的handle是否在元素内部插入，默认false
   */
  inside?: boolean;
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁且元素移动到最后位置。默认false
   */
  ghost?: boolean;
  ghostClass?: string;
  /**
   * 自定义handle选择器，多个使用空格分隔。handle元素可以是与分割元素平级或在分割元素内
   */
  handle?: string;
  onStart?: (data: { size1: number; size2: number }, event: MouseEvent) => void;
  onSplit?: (data: { size1: number; size2: number }, event: MouseEvent) => void;
  onEnd?: (data: { size1: number; size2: number }, event: MouseEvent) => void;
  onSticky?: (
    data: { size1: number; size2: number; position: "start" | "end" | "none" },
    event: MouseEvent
  ) => void;
  onClone?: (data: { clone: HTMLElement }, event: MouseEvent) => void;
};

export type DraggableOptions = {
  /**
   * 使用transform属性控制位移，默认true
   */
  useTransform?:boolean;
  /**
   * 是否不响应子元素触发，默认true
   */
  self?:boolean;
  /**
   * 鼠标控制时的按键，默认left
   */
  mouseButton?: 'all' | "left" | "right";
  /**
   * 限制活动范围，默认false
   * boolean 值会获取第一个可拖动元素的parent元素
   * string 选择器选中的第一个元素
   * HTMLElement 包裹所有可拖动元素的容器
   */
  containment?: boolean | HTMLElement | string;
  /**
   * 如果可拖动目标为选择器，会自动检测watch容器内选择器元素变动并附加拖动能力。默认true
   * boolean 时容器取元素第一个的parent
   * string 时获取选择器元素第一个
   */
  watch?: boolean | string;
  /**
   * 拖动起始阈值，默认0
   */
  threshold?: number;
  /**
   * 实际响应拖动的元素选择器，字符串
   */
  handle?: string;
  /**
   * 禁止触发元素的css选择器
   */
  filter?: string;
  /**
   * 拖动目标，dom/selector数组，用于拖动交互事件
   */
  droppable?:
    | (() => NodeList | HTMLCollection | HTMLElement[])
    | string
    | HTMLElement
    | HTMLElement[];
  /**
   * 开启ghost模式后，拖动元素时会自动创建元素副本并拖动副本，当拖动结束后，副本销毁并且元素移动到最后位置。默认false，支持函数返回副本元素
   */
  ghost?: ((el: HTMLElement) => HTMLElement) | boolean;
  ghostClass?: string;
  /**
   * 传递v/h可实现单向拖动。默认''
   */
  direction?: "v" | "h";
  /**
   * 是否在鼠标到达容器边缘时自动滚动，默认true
   */
  scroll?: boolean;
  /**
   * 滚动速度，默认10
   */
  scrollSpeed?: number;
  /**
   * 拖动时元素的zIndex
   */
  zIndex?: number;
  /**
   * 可将不同的拖动元素编为一组，拖动时会自动管理zIndex
   */
  group?: string;
  /**
   * 拖动时应用的class样式，多个使用空格分开
   */
  classes?: string;
  /**
   * 拖动元素可自动吸附的目标元素选择器。字符串
   */
  snap?: string;
  snapOptions?: {
    /**
     * 吸附元素的移动误差，默认10
     */
    tolerance: number;
  };
  /**
   * 可定义拖动时不同状态下的指针，默认move
   */
  cursor?: {
    default?: string;
    active?: string;
    over?: string;
  };
  /**
   * 网格拖动模式，每次移动指定的网格大小。数字或数字数组
   */
  grid?: number | number[];
  /**
   * 拖动类型标识，用于droppable识别交互类型
   */
  type?: string;
  /**
   * 指针点击时触发，可用于阻止后续逻辑
   * @param event
   * @returns 返回false则停止后续逻辑
   */
  onPointerDown?: (
    data: { draggable: HTMLElement | SVGGraphicsElement },
    event: MouseEvent
  ) => boolean;
  onStart?: (
    data: {
      draggable: HTMLElement | SVGGraphicsElement;
      x: number;
      y: number;
      transform: UiiTransform;
    },
    event: MouseEvent
  ) => void;
  /**
   * 拖动中调用，返回false阻止dom移动
   * @param dragDom
   * @param ev
   * @param offsetX
   * @param offsetY
   * @returns
   */
  onDrag?: (
    data: {
      draggable: HTMLElement | SVGGraphicsElement;
      x: number;
      y: number;
      ox: number;
      oy: number;
      transform: UiiTransform;
    },
    event: MouseEvent
  ) => boolean | void;
  /**
   * 拖动结束后调用，返回false阻止ghost模式下的dom移动
   * @param dragDom
   * @param ev
   * @returns
   */
  onEnd?: (
    data: {
      draggable: HTMLElement | SVGGraphicsElement;
      x: number;
      y: number;
      transform: UiiTransform;
    },
    event: MouseEvent
  ) => boolean | void;
  onClone?: (
    data: { clone: HTMLElement | SVGGraphicsElement },
    event: MouseEvent
  ) => void;
  onSnap?: (
    data: {
      el: HTMLElement | SVGGraphicsElement;
      targetH: HTMLElement | SVGGraphicsElement;
      targetV: HTMLElement | SVGGraphicsElement;
      dirH: string;
      dirV: string;
    },
    event: MouseEvent
  ) => void;
};

export type DroppableOptions = {
  /**
   * 如果可响应元素为选择器，会在每次拖动开启时自动重置匹配的可响应元素。默认true
   */
  watch?: boolean;
  /**
   * 当accepts的draggable对象开始拖动时，自动设置该样式。多个样式使用空格分隔
   */
  activeClass?: string;
  /**
   * 当accepts的draggable对象拖动到droppable元素上时，自动设置该样式。多个样式使用空格分隔
   */
  hoverClass?: string;
  /**
   * 定义哪些draggable元素进行交互。如果是字符串，支持不同Draggable对象进行编组
   */
  accepts?:
    | ((ele: Array<HTMLElement>, draggable: HTMLElement) => boolean)
    | string;
  /**
   * 当accepts的draggable对象开始拖动时触发
   * @param draggable
   * @param ele
   * @returns
   */
  onActive?: (data: {
    draggable: HTMLElement;
    droppables: Array<HTMLElement>;
  }) => void;
  onEnter?: (
    data: { draggable: HTMLElement; droppable: HTMLElement },
    event: MouseEvent
  ) => void;
  onOver?: (
    data: { draggable: HTMLElement; droppable: HTMLElement },
    event: MouseEvent
  ) => void;
  onLeave?: (
    data: { draggable: HTMLElement; droppable: HTMLElement },
    event: MouseEvent
  ) => void;
  onDrop?: (
    data: { draggable: HTMLElement; droppable: HTMLElement },
    event: MouseEvent
  ) => void;
  /**
   * 当accepts的draggable对象结束拖动时触发
   * @param draggable
   * @param ele
   * @returns
   */
  onDeactive?: (data: {
    draggable: HTMLElement;
    droppables: Array<HTMLElement>;
  }) => void;
};

export type RotatableOptions = {
  /**
   * 可定义拖动时不同状态下的指针，默认crosshair
   */
  cursor?: {
    default?: string;
    active?: string;
  };
  //相对于图形左上角的圆心偏移，支持数字/百分比
  //仅对SVG元素有效，对于非SVG元素使用transform-origin属性
  ox?: number | string;
  oy?: number | string;
  /**
   * 控制器元素选择器(1-n个元素)，如果为空表示点击任意元素即可触发
   */
  handle?:
    | ((
        target: HTMLElement | SVGGraphicsElement
      ) =>
        | NodeList
        | HTMLCollection
        | HTMLElement[]
        | HTMLElement
        | SVGGraphicsElement)
    | string
    | NodeList
    | HTMLCollection
    | HTMLElement[]
    | HTMLElement
    | SVGGraphicsElement;
  /**
   * 指针点击时触发，可用于阻止后续逻辑
   * @param event
   * @returns 返回false则停止后续逻辑
   */
  onPointerDown?: (event: MouseEvent) => boolean;
  onStart?: (
    data: { deg: number; cx: number; cy: number },
    event: MouseEvent
  ) => {};
  onRotate?: (
    data: {
      deg: number;
      cx: number;
      cy: number;
      ox: number;
      oy: number;
      target: HTMLElement | SVGGraphicsElement;
    },
    event: MouseEvent
  ) => {};
  onEnd?: (data: { deg: number }, event: MouseEvent) => {};
};

export type SelectableOptions = {
  /**
   * 选择器样式字符串，多个使用空格分隔
   */
  class?: string;
  /**
   * 选择器拖动进行中，被选中元素应用的样式字符串，多个使用空格分隔
   */
  selectingClass?: string;
  /**
   * 选择器拖动结束后，被选中元素应用的样式字符串，多个使用空格分隔
   */
  selectedClass?: string;
  /**
   * 容器中可选择的元素。可以是选择器字符串或返回元素数组的函数
   */
  targets?: (() => NodeList | HTMLCollection | HTMLElement[]) | string;
  /**
   * 选择模式，默认overlap
   */
  mode?: "overlap" | "inclusion";
  /**
   * 是否在鼠标到达容器边缘时自动滚动，默认true
   */
  scroll?: boolean;
  /**
   * 滚动速度，默认10
   */
  scrollSpeed?: number;
  /**
   * 禁止触发元素的css选择器或校验函数，函数返回true表示需要过滤
   */
  filter?: ((el: HTMLElement) => boolean) | string;
  /**
   * 指针点击时触发，可用于阻止后续逻辑
   * @param event
   * @returns 返回false则停止后续逻辑
   */
  onPointerDown?: (event: MouseEvent) => boolean;
  onStart?: (
    data: { selection: Array<HTMLElement>; selectable: HTMLElement },
    event: MouseEvent
  ) => void;
  //选中元素变动时触发
  onSelect?: (
    data: { selection: Array<HTMLElement>; selectable: HTMLElement },
    event: MouseEvent
  ) => void;
  onEnd?: (
    data: { selection: Array<HTMLElement>; selectable: HTMLElement },
    event: MouseEvent
  ) => void;
};

export type SortableOptions = {
  /**
   * 是否在鼠标到达容器边缘时自动滚动，默认true
   */
  scroll?: boolean;
  /**
   * 滚动速度，默认10
   */
  scrollSpeed?: number;
  /**
   * 禁止触发元素的css选择器
   */
  filter?: string;
  /**
   * ghost元素插入的容器，默认document.body
   */
  ghostContainer?: HTMLElement;
  /**
   * ghost元素样式
   */
  ghostClass?: string;
  /**
   * 用于标识一组sortable容器。当newSortable容器是一组元素时即使该属性为空，也会自动创建匿名group
   */
  group?: string;
  /**
   * 自定义handle选择器
   */
  handle?: string;
  /**
   * 当相同group的sortable元素开始拖动时，自动为move.from为true的sortable容器设置该样式。多个样式使用空格分隔
   */
  activeClass?: string;
  /**
   * 指定sortable元素的拖动策略
   */
  move?: {
    /**
     * 表示元素从fromContainer的移出策略，默认true
     */
    to?: ((item: HTMLElement, from: HTMLElement) => boolean) | boolean | "copy";
    /**
     * 表示来自fromContainer的元素对toContainers的移入策略，默认true
     */
    from?:
      | ((item: HTMLElement, from: HTMLElement, to: HTMLElement) => boolean)
      | boolean;
  };
  /**
   * 当ghost元素移出容器后列表元素的处理方式
   * remove 删除列表元素
   * revert 复原拖动前位置
   */
  spill?: "remove" | "revert";
  /**
   * 是否可排序，默认true
   */
  sort?: boolean;
  /**
   * 当一组中的任意sortable容器中的元素被拖动时，其他容器会触发激活事件
   * @param data
   * @param event
   * @returns
   */
  onActive?: (data: { item: HTMLElement; from: HTMLElement }) => void;
  onDeactive?: (data: { item: HTMLElement; from: HTMLElement }) => void;
  onStart?: (
    data: { item: HTMLElement; from: HTMLElement; index: number },
    event: MouseEvent
  ) => void;
  /**
   * 拖动结束后触发
   * @param data
   * @param event
   * @returns
   */
  onEnd?: (
    data: { item: HTMLElement; from: HTMLElement; to: HTMLElement },
    event: MouseEvent
  ) => void;
  /**
   * 拖动中且排序发生变更时触发
   * @param data
   * @param event
   */
  onChange?: (
    data: {
      item: HTMLElement;
      from: HTMLElement;
      to: HTMLElement;
      fromIndex: number;
      toIndex: number;
    },
    event: MouseEvent
  ) => void;
  /**
   * 拖动结束后，如果列表排序发生变更时触发，包括顺序变更或新增节点或移除节点
   * @param data
   * @param event
   */
  onUpdate?: (
    data: { item: HTMLElement; from: HTMLElement; to: HTMLElement },
    event: MouseEvent
  ) => void;
  /**
   * 拖动中指针进入sortable容器时触发
   * @param data
   * @param event
   */
  onEnter?: (
    data: {
      item: HTMLElement;
      from: HTMLElement;
      to: HTMLElement;
      dir: string;
    },
    event: MouseEvent
  ) => void;
  /**
   * 拖动中指针离开sortable容器时触发
   * @param data
   * @param event
   */
  onLeave?: (
    data: { item: HTMLElement; from: HTMLElement; to: HTMLElement },
    event: MouseEvent
  ) => void;
  /**
   * 拖动元素插入到sortable容器中时触发
   * @param data
   * @param event
   */
  onAdd?: (
    data: {
      item: HTMLElement;
      from: HTMLElement;
      to: HTMLElement;
      index: number;
    },
    event: MouseEvent
  ) => void;
  /**
   * 拖动元素从sortable容器中删除时触发
   * @param data
   * @param event
   */
  onRemove?: (
    data: { item: HTMLElement; from: HTMLElement; to: HTMLElement },
    event: MouseEvent
  ) => void;
};

export type CollisionDetectorOptions = {
  container?: Element;
};

export type CollisionData = {
  //top left
  x1: number;
  y1: number;
  //bottom right
  x2: number;
  y2: number;
  el?: HTMLElement;
};

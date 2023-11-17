/* eslint-disable max-len */
/**
 * dom rotator
 * @author holyhigh2
 */
import { each } from "myfx/collection";
import { RotatableOptions, Uii } from "./types";
import { UiiTransformer, rotateTo, wrapper } from "./transform";
import { isFunction, isString } from "myfx/is";
import { closest } from "myfx/tree";
import {
  ONE_RAD,
  getCenterXy,
  getCenterXySVG,
  getMatrixInfo,
  getPointInContainer,
  getStyleSize,
  parseOxy,
} from "./utils";
import { lowerCase } from "myfx/string";

const THRESHOLD = 2;
const CLASS_ROTATABLE = "uii-rotatable";
const CLASS_ROTATABLE_HANDLE = "uii-rotatable-handle";
const CLASS_ROTATABLE_ACTIVE = "uii-rotatable-active";

/**
 * 用于表示一个或多个可旋转元素的定义
 * > 可用CSS接口
 * - .uii-rotatable
 * - .uii-rotatable-handle
 * - .uii-rotatable-active
 * @public
 */
export class Rotatable extends Uii {
  constructor(els: string | Element, opts?: RotatableOptions) {
    super(els, opts);

    each(this.ele, (el) => {
      initHandle(this, el, this.opts);
    });
  }
}

function initHandle(
  uiik: Uii,
  el: HTMLElement | SVGGraphicsElement,
  opts: RotatableOptions
) {
  let handleStr = opts.handle;
  let handles: any;
  if (isString(handleStr)) {
    handles = document.querySelectorAll(handleStr);
  } else if (isFunction(handleStr)) {
    handles = handleStr(el);
  }
  if (!handles) {
    console.error('Can not find handles with "' + el.outerHTML + '"');
    return;
  }

  each(handles, (h: SVGStyleElement | HTMLStyleElement) => {
    h.classList.add(CLASS_ROTATABLE_HANDLE);
    h.style.cursor = opts.cursor?.default || "crosshair";

    bindHandle(uiik, h, el as HTMLElement, opts);
  });

  el.classList.toggle(CLASS_ROTATABLE, true);
}

function bindHandle(
  uiik: Uii,
  handle: Element,
  el: HTMLElement,
  opts: RotatableOptions
) {
  const onStart = opts.onStart;
  const onRotate = opts.onRotate;
  const onEnd = opts.onEnd;

  let deg = 0;
  uiik.addPointerDown(
    handle,
    ({ onPointerStart, onPointerMove, onPointerEnd }) => {
      let centerX = 0,
        centerY = 0;

      let startOx = 0;
      let startOy = 0;
      let startDeg = 0;
      let container: HTMLElement | SVGGraphicsElement;
      let transformer: UiiTransformer;

      //bind events
      onPointerStart(function (args: Record<string, any>) {
        const { ev } = args;

        transformer = wrapper(el);

        const { w, h } = getStyleSize(el);

        const { originX, originY } = parseOxy(opts.ox, opts.oy, w, h);
        startOx = originX;
        startOy = originY;

        const { x, y, ox, oy } =
          el instanceof SVGGraphicsElement
            ? getCenterXySVG(el, startOx, startOy)
            : getCenterXy(el, startOx, startOy);
        (centerX = x), (centerY = y);
        (startOx = ox), (startOy = oy);

        container =
          el instanceof SVGGraphicsElement
            ? closest(
                el,
                (ele) => lowerCase(ele.tagName) === "svg",
                "parentNode"
              )
            : (el.parentElement as any);

        const currentXy = getPointInContainer(ev, container);
        startDeg =
          Math.atan2(currentXy.y - centerY, currentXy.x - centerX) * ONE_RAD +
          90;

        if (startDeg < 0) startDeg = 360 + startDeg;

        let matrixInfo = getMatrixInfo(el);

        startDeg -= matrixInfo.angle;

        //apply classes
        el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true);
        onStart && onStart({ deg, cx: centerX, cy: centerY }, ev);
      });
      onPointerMove((args: Record<string, any>) => {
        const { ev } = args;

        const currentXy = getPointInContainer(ev, container);

        deg =
          Math.atan2(currentXy.y - centerY, currentXy.x - centerX) * ONE_RAD +
          90 -
          startDeg;

        onRotate &&
          onRotate(
            {
              deg,
              cx: centerX,
              cy: centerY,
              target: el,
              ox: startOx,
              oy: startOy,
            },
            ev
          );

        rotateTo(el, deg, startOx, startOy);
      });
      onPointerEnd((args: Record<string, any>) => {
        const { ev } = args;
        el.classList.toggle(CLASS_ROTATABLE_ACTIVE, false);

        onEnd && onEnd({ deg }, ev);
      });
    },
    {
      threshold: THRESHOLD,
      lockPage: true,
    }
  );
}

/**
 * Make els rotatable
 * @param els selector string / html element
 * @param opts
 * @returns
 */
export function newRotatable(
  els: string | HTMLElement,
  opts?: RotatableOptions
): Rotatable {
  return new Rotatable(els, opts);
}

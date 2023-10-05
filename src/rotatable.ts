/* eslint-disable max-len */
/**
 * dom rotator
 * @author holyhigh2
 */
import { each } from "myfx/collection";
import { RotatableOptions, Uii } from "./types";
import { rotateTo } from "./transform";
import { isFunction, isString } from "myfx/is";
import { ONE_RAD, getCenterXy, getMatrixInfo, getPointInContainer } from "./utils";
import 'myfx'

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
      const { x, y, ox, oy } = getCenterXy(el);
      let centerX = x,
        centerY = y;
      let startDeg = 0

      //bind events
      onPointerStart(function (args: Record<string, any>) {
        const { ev } = args;

        const currentXy = getPointInContainer(ev, el.parentElement as any);
        startDeg =
          Math.atan2(currentXy.y - centerY, currentXy.x - centerX) * ONE_RAD + 90;
        if (startDeg < 0) startDeg = 360 + startDeg;

        let matrixInfo = getMatrixInfo(el)

        startDeg -= matrixInfo.angle

        //apply classes
        el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true);
        onStart && onStart({ deg, cx: centerX, cy: centerY }, ev);
      });
      onPointerMove((args: Record<string, any>) => {
        const { ev} = args;

        const currentXy = getPointInContainer(ev, el.parentElement as any);

        deg =
          Math.atan2(currentXy.y - centerY, currentXy.x - centerX) * ONE_RAD +
          90 - startDeg

        onRotate && onRotate({ deg, cx: centerX, cy: centerY }, ev);

        rotateTo(el, deg, ox, oy);
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

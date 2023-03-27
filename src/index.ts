import { newSplittable } from './splittable'
import { newResizable } from './resizable'
import { newDraggable } from './draggable'
import { newDroppable } from './droppable'
import { newRotatable } from './rotatable'
import { newSelectable } from './selectable'

import * as packageInfo from '../package.json'

// welcome info
const welcome = (globalThis as any).welcome
if (!welcome) {
  const ssAry: string[] = []
  ;['102,227,255', '59,208,251', '67,180,255'].forEach((v, i) => {
    const cu = 'background:rgb(' + v + ');'
    if (i < 2) {
      ssAry[i] = ssAry[5 - 1 - i] = cu
    } else {
      ssAry[i] = 'color:#fff;' + cu
    }
  })
  console.info(
    `%c %c %c Uiik - UI interactions kit | v${packageInfo.version} %c %c `,
    ...ssAry,
    `💎 ${packageInfo.repository.url}`
  )

  ;(globalThis as any).welcome = true
  
}

export * from './splittable'
export * from './resizable'
export * from './draggable'
export * from './droppable'
export * from './rotatable'
export * from './selectable'
export * from './detector'
export * from './types'

export const VERSION = packageInfo.version

export default {
  VERSION: packageInfo.version,
  newSplittable,
  newResizable,
  newDraggable,
  newDroppable,
  newRotatable,
  newSelectable
}

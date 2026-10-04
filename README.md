![npm](https://img.shields.io/npm/v/uiik?style=plastic)
![NPM](https://img.shields.io/npm/l/uiik)
![types](https://img.shields.io/npm/types/uiik)
![license](https://img.shields.io/npm/l/uiik)

# uiik

A UI interactions kit — draggable, droppable, resizable, rotatable, splittable, selectable, sortable, plus the geometry and measurement utilities they are built on. One set of options and one set of CSS hooks for both HTML and SVG.

- [📑 Doc](https://uiik.pages.dev/)

## Features

- **Interactions** — `newDraggable` `newDroppable` `newResizable` `newRotatable` `newSplittable` `newSelectable` `newSortable` `newCollisionDetector`
- **Rich options** — 30 options on `Draggable` alone: containment, ghost, group, snap, grid, axis, scroll, callbacks…
- **Geometry** — `alignRects` `distributeRects` `snapGuides` `findSnap` `fitRectInViewport` `zoomAt` `panBy`…
- **Measurement** — `getRectInContainer` `getVertex` `getMatrixInfo` `getScrollParent`… 23 helpers that work on HTML and SVG
- **Transform** — `wrapper()` returns a `UiiTransform` that hides the `transform` differences between HTML and SVG
- **Customizable CSS hooks** — `uii-draggable-handle`, `uii-splittable-handle`, `uii-selector`…
- **SVG support** — the same API drives `<g>` and `<rect>` as it does `<div>`

## Quick start

```sh
npm i uiik
```

```ts
import { newDraggable } from 'uiik'

newDraggable('.card', {
  containment: '#stage',
  ghost: true,
  grid: 8,
  onEnd({ target }) {
    console.log(target.dataset.id)
  },
})
```

`els` accepts a selector, an element, or an array of either; `opts` is optional everywhere.

### Options

Every interaction takes an options object with sensible defaults, and every option is optional:

```ts
newDraggable('.card', {
  threshold: 3,        // px before a drag starts
  containment: '#stage',// stay inside this element
  ghost: true,         // drag a clone, snap into place on drop
  handle: '.grip',     // only drag from this part
  filter: '.no-drag',  // ignore drags starting on this
  grid: 8,             // constrain to an 8px grid
  snap: '.card',       // snap to these targets
  snapOptions: { tolerance: 10 },
  group: 'cards',      // drag between containers in the same group
  scroll: true,        // auto-scroll when dragging near an edge
  onStart: ({ target }) => {}, // onDrag / onEnd / onClone / onSnap
})
```

### Import a single module

Each source module is published separately, so you can import just what you need. Subpaths are isolated — `uiik/sortable` does not expose the geometry helpers:

```ts
import { newSortable } from 'uiik/sortable'
import { newDraggable } from 'uiik/draggable'
import { findSnap } from 'uiik/geometry'
```

| Subpath | Exports |
| --- | --- |
| `uiik/sortable` | `Sortable` `newSortable` |
| `uiik/draggable` | `Draggable` `newDraggable` |
| `uiik/droppable` | `Droppable` `newDroppable` |
| `uiik/resizable` | `Resizable` `newResizable` |
| `uiik/rotatable` | `Rotatable` `newRotatable` |
| `uiik/selectable` | `Selectable` `newSelectable` |
| `uiik/splittable` | `Splittable` `newSplittable` |
| `uiik/detector` | `CollisionDetector` `newCollisionDetector` |
| `uiik/geometry` | `alignRects` `distributeRects` `findSnap` `snapGuides` `snapToGrid` `zoomAt` `panBy`… |
| `uiik/utils` | `getBox` `getRectInContainer` `getVertex` `getScrollParent`… |
| `uiik/transform` | `wrapper` `moveTo` `rotateTo` `getTranslate`… |
| `uiik/types` | `Uii` `UII_KEY` |

The root entry re-exports everything, plus a `default` export and `VERSION`.

### HTML and SVG

`wrapper()` gives you the same transform API regardless of the element type:

```ts
import { wrapper } from 'uiik'

const t = wrapper(svgGroup)   // or an HTMLElement — same calls
t.moveTo(100, 50)
t.rotateTo(15)
```

## API overview

70 exports in six groups:

| Group | Count | Highlights |
| --- | --- | --- |
| Interactions | 8 | the `newXxx` factories |
| Classes | 10 | `Uii` base class + one per interaction + `UiiTransform` |
| Geometry | 16 | `alignRects` `distributeRects` `snapGuides` `zoomAt` `panBy` |
| Transform | 6 | `wrapper` `moveTo` `moveBy` `rotateTo` `getTranslate` |
| Measurement | 23 | `getRectInContainer` `getVertex` `getScrollParent` `isVisible` |
| Constants | 7 | `THRESHOLD` `EDGE_THRESHOLD` `ONE_ANG` `VERSION` |

Full signatures live in the [documentation](https://holyhigh2.github.io/uiik/).

### CSS hooks

Style the generated elements instead of fighting them:

`uii-draggable` `uii-draggable-active` `uii-draggable-handle` `uii-draggable-ghost`
`uii-droppable` `uii-resizable-handle` `uii-resizable-handle-active` `uii-resizable-ghost`
`uii-rotatable` `uii-rotatable-handle` `uii-rotatable-active`
`uii-splittable` `uii-splittable-h` `uii-splittable-v` `uii-splittable-handle` `uii-splittable-handle-ghost`
`uii-sortable-container` `uii-sortable-active` `uii-sortable-ghost`
`uii-selecting` `uii-selected` `uii-selector`

Resizable handles are suffixed per direction: `uii-resizable-handle-n`, `-e`, `-s`, `-w`, …

## Notes

- **Dragging inside a positioned parent.** Cursor tracking is computed from `offsetParent`. If a draggable's `offsetParent` is not its `parentNode` and intermediate elements introduce margins, the pointer can drift from the element.
- **`scroll` is opt-in.** `draggable`, `selectable` and `sortable` all default `scroll: false` so that dragging never moves the page unless you ask for it.

## Development

| Script | What it does |
| --- | --- |
| `npm run build` | produces the whole publishable package into `dist/`: `index.js` and `uiik.min.js` (UMD), per-module ESM, type declarations |
| `npm run test:unit` | runs the unit tests (`node --test`) |
| `npm run doc` | generates the markdown docs from TSDoc |

The pages under `website/` are the primary way to see behaviour: every card shows the exact source, and the DOM and SVG pages cover the same interactions in both flavours. `website/index-api.html` lists every export with its signature and arity, generated from the module at runtime.

## License

MIT

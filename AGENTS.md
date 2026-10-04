# AGENTS.md

Instructions for AI coding agents working in this repository. Applies to the whole project
unless a nested `AGENTS.md` in a subdirectory says otherwise.

## Project

uiik is a framework-agnostic UI interactions library written in TypeScript: draggable,
droppable, resizable, rotatable, splittable, selectable, sortable, plus the geometry,
transform and measurement helpers they are built on. It targets both HTML and SVG elements.
The only runtime dependency is `myfx`; it is treated as external in the build.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | install dependencies |
| `npm run build` | build the publishable package into `dist/` (must run first; it owns `emptyOutDir`) |
| `npm run test:unit` | run the unit tests (`node --test` + jsdom) |
| `npm run doc` | regenerate `docs/` markdown from TSDoc |
| `npm run pack-test` | `npm pack --dry-run`; inspect what would actually be published |
| `npm run website` / `npm run website:build` | serve / build the demo pages |

Run `npm run build` before `npm run pack-test`. The build is two passes over the same
`dist/`: `vite.config.mjs` (UMD + type declarations, `emptyOutDir: true`) then
`vite.config.esm.mjs` (per-module ESM, `emptyOutDir: false`). Swapping the order wipes the
ESM output.

## Layout

- `src/` — one file per interaction (`draggable.ts`, `sortable.ts`, …) plus shared
  `geometry.ts`, `transform.ts`, `utils.ts`, `types.ts`. `index.ts` is the root entry.
- `spec/` — `node:test` specs; `setup-dom.mjs` installs a jsdom global before any module loads.
- `dist/` — build output (gitignored, but published).
- `docs/` — TSDoc-generated markdown (gitignored).
- `website/` — demo pages and their scripts.
- Root `vite.*.mjs` — build configs; `vite.shared.mjs` holds the shared `myfx` external.

## Conventions

- TypeScript, 2-space indentation, single quotes, no semicolons. ESLint extends `google`.
- Source comments and TSDoc are written in Chinese; keep new comments in Chinese for
  consistency, but keep identifiers and public API docs in English.
- Import shared helpers from `myfx` rather than re-implementing them; keep `myfx` external
  in build config.
- Relative imports within `src/` omit the extension (`./geometry`). Do not add `.ts`.
- Each interaction module exports a factory `newXxx`, its class, and its option type, and is
  wired into the subpath exports. Adding a module means updating `src/index.ts`, the build
  inputs (the ESM config globs `src/*.ts` automatically), and the export table in `README.md`.

## Testing

- Tests run in jsdom, which has **no layout**: every `getBoundingClientRect()` returns 0.
  Unit tests therefore cover event flow and state/class markers, not geometry math. Verify
  geometry through the `website/` demos instead.
- `scroll` defaults to `false` on draggable/selectable/sortable by design; do not flip it
  to make a test pass.
- Exceptions thrown inside event listeners do not bubble out of `dispatchEvent()`; use the
  `__takeUncaught()` helper from `setup-dom.mjs` when asserting that nothing throws.

## Gotchas

- Cursor tracking is computed from `offsetParent`. If a draggable's `offsetParent` is not
  its `parentNode` and intermediate elements add margins, the pointer can drift.
- `dist/` and `docs/` are gitignored. Publishing is controlled solely by the `files`
  whitelist in `package.json` (`dist`, `CHANGELOG.md`, `README_ZH.md`); `README.md`,
  `LICENSE` and `package.json` are always included by npm. Add anything else you intend to
  ship to that list, then confirm with `npm run pack-test`.

## Publishing

Bump `version` in `package.json`, add a `CHANGELOG.md` entry, rebuild, run the tests, and
check `npm run pack-test` output before publishing. Never commit `dist/` or `docs/`.

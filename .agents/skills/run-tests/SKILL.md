---
name: run-tests
description: Run and interpret the uiik unit test suite. Use when the user asks to run tests, verify a change, reproduce a failure, or do regression testing.
---

# Run the uiik unit tests

```sh
npm run test:unit
```

This runs `node --test --import ./spec/setup-dom.mjs "spec/**/*.spec.ts"`.

- `spec/setup-dom.mjs` installs a jsdom global **before** any spec module is evaluated,
  because some uiik modules touch `document` at import time. That is why the runner uses
  `--import` rather than an `import` inside a spec.
- `spec/ts-resolve.mjs` lets Node resolve the extensionless relative imports used in `src/`.

## What the suite can and cannot cover

jsdom has no layout engine, so every `getBoundingClientRect()` returns `0`. The specs assert
event flow and state/class markers only — **not** geometry math. Geometry changes must be
verified through the `website/` demos instead.

## Interpreting failures

- An exception thrown inside an event listener does **not** bubble out of `dispatchEvent()`.
  A `assert.doesNotThrow(() => el.dispatchEvent(...))` is always green. Use the
  `__takeUncaught()` helper exported by `setup-dom.mjs` to collect listener errors.
- Between cases, `__resetDom()` clears `document.body` and the captured-error buffer; call it
  if a spec mutates global state.
- If a test seems to need `scroll: true`, reconsider: `scroll` defaults to `false` on
  draggable/selectable/sortable by design.

Report the failing spec name and the assertion, and reproduce with a single file, e.g.
`node --test --import ./spec/setup-dom.mjs spec/geometry.spec.ts`.

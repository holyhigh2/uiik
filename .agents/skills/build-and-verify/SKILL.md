---
name: build-and-verify
description: Build the uiik package and verify the published artifact. Use when the user asks to build, package, publish-check, or confirm what files ship — anything touching `npm run build` or `npm run pack-test`.
---

# Build and verify uiik

The build is **two sequential passes** into the same `dist/`. Run them via the script so the
order is preserved:

```sh
npm run build
```

That expands to:

1. `vite build --config vite.config.mjs` — UMD bundle (`dist/index.js`), minified UMD
   (`dist/uiik.min.js`) and type declarations. This pass has `emptyOutDir: true`, so it must
   run first.
2. `vite build --config vite.config.esm.mjs` — one ESM file per source module, so subpath
   imports like `uiik/sortable` resolve at runtime. This pass has `emptyOutDir: false`.

Never run only the second config, and never reorder them — doing so leaves `dist/` without
the UMD entry or wipes the ESM output.

## Verify the artifact

```sh
npm run pack-test
```

This is `npm pack --dry-run`. Check:

- The file count and size are sane; there should be no `gitignore-fallback` warning.
- Only `dist/**` plus `README.md`, `README_ZH.md`, `CHANGELOG.md`, `LICENSE` and
  `package.json` are listed.
- Publish scope is governed by the `files` whitelist in `package.json`. If you added a
  module, confirm its `dist/<name>.js` and `dist/<name>.d.ts` are present.

## After building

If the change affects behavior, run the unit tests (`npm run test:unit`) and regenerate docs
(`npm run doc`) if public API or TSDoc changed. Do not commit `dist/` or `docs/` — both are
gitignored and regenerated.

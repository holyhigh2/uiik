import { createRequire } from "node:module";

const pkg = createRequire(import.meta.url)("./package.json");

export { pkg };

export const banner = () => `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.repository.url}
 * c) 2021-${new Date().getFullYear()} @${
  pkg.author
} may be freely distributed under the MIT license
 */
`;

export const devBanner = () =>
  `/* ${pkg.name} ${pkg.version} @${pkg.author} ${pkg.repository.url} */\n`;

export const external = [/^myfx(\/.*)?$/];

export const globals = (id) => id.replace(/^myfx\/?/, "") || "myfx";

export const umdOutput = {
  banner,
  globals,
  comments: false,
};

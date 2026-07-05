import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function patch(file, replacements, label) {
  if (!existsSync(file)) return;
  let source = readFileSync(file, 'utf-8');
  let changed = false;
  for (const [broken, fixed] of replacements) {
    if (source.includes(broken)) {
      source = source.replace(broken, fixed);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(file, source);
    console.log(`Patched react-snap: ${label}`);
  }
}

// react-snap (unmaintained since ~2020) calls private/legacy Puppeteer APIs
// that modern Puppeteer versions no longer expose the same way:
// - `page._client` used to be a property, now it's a method.
// - `page.removeListener` (Node EventEmitter alias) was renamed to `page.off`.
// - `page.waitFor` (generic wait helper) was removed entirely, with no direct
//   Puppeteer replacement left across versions — use a plain JS timeout instead.
patch(
  path.resolve(__dirname, '../node_modules/react-snap/src/puppeteer_utils.js'),
  [
    [
      'await page._client.send("ServiceWorker.disable");',
      'await (typeof page._client === "function" ? page._client() : page._client).send("ServiceWorker.disable");',
    ],
    [
      'if (options.waitFor) await page.waitFor(options.waitFor);',
      'if (options.waitFor) await new Promise(resolve => setTimeout(resolve, options.waitFor));',
    ],
  ],
  '_client API + waitFor (puppeteer_utils.js)'
);

patch(
  path.resolve(__dirname, '../node_modules/react-snap/src/tracker.js'),
  [[
    'page.removeListener("request", onStarted);\n      page.removeListener("requestfinished", onFinished);\n      page.removeListener("requestfailed", onFinished);',
    'page.off("request", onStarted);\n      page.off("requestfinished", onFinished);\n      page.off("requestfailed", onFinished);',
  ]],
  'removeListener -> off (tracker.js)'
);

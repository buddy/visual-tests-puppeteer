# Visual Test Puppeteer Plugin

A Puppeteer plugin for performing visual testing using Buddy Works Visual Testing. This plugin allows automatic capturing of website snapshots across different screen resolutions and comparing them with reference versions to detect visual regressions.

## Requirements

- **Node.js** `>=20`
- **Puppeteer** `>=23.10.0`
- **[bdy CLI](https://www.npmjs.com/package/bdy)** — tests must be run through the CLI within a visual testing session, e.g. `bdy tests visual session create "node index.js"`

## Installation

```bash
npm install @buddy-works/visual-tests-puppeteer
```

## Usage

### ESM (`import`)

```javascript
import puppeteer from "puppeteer";
import VisualTestsPlugin from "@buddy-works/visual-tests-puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
const visualTests = new VisualTestsPlugin();

await page.goto("https://example.com");

await visualTests.takeSnap(page, "homepage", {
  devices: [{ viewport: { width: 1366, height: 768 } }],
  colorScheme: "DARK",
  cloneCookies: true,
});

await browser.close();
```

### CommonJS (`require`)

```javascript
const puppeteer = require("puppeteer");
const { VisualTestsPlugin } = require("@buddy-works/visual-tests-puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const visualTests = new VisualTestsPlugin();

  await page.goto("https://example.com");

  await visualTests.takeSnap(page, "homepage", {
    devices: [{ viewport: { width: 1366, height: 768 } }],
    colorScheme: "DARK",
    cloneCookies: true,
  });

  await browser.close();
}

run();
```

## Examples

Example usage of the plugin can be found in the `examples/` directory:

```bash
# Install dependencies
pnpm i
# Build plugin
pnpm run build
# Go to examples folder
cd examples
# Install examples dependencies
pnpm i
# Add enviroment variables with token
export BUDDY_VT_TOKEN=****
# Run an example
pnpm run test
```

## License

MIT

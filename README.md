# Visual Test Puppeteer Plugin


A Puppeteer plugin for performing visual testing using Buddy Works Visual Testing. This plugin allows automatic capturing of website snapshots across different screen resolutions and comparing them with reference versions to detect visual regressions.

## Requirements

- Node.js >= 20
- Puppeteer >= 23.10.0

## Installation

```bash
npm install @buddy-works/visual-tests-puppeteer
```

## Usage

```javascript
import { takeSnap } from '@buddy-works/visual-tests-puppeteer';
import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://buddy.works/blog');
  await takeSnap(page, 'example-homepage');
  
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
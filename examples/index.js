import puppeteer from "puppeteer";
import VisualTestsPlugin from "../dist/index.mjs";

async function testExample(browser) {
  const page = await browser.newPage();
  const visualTests = new VisualTestsPlugin();

  try {
    await page.goto("https://buddy.works");

    await page.waitForSelector("h1", { visible: true });

    await visualTests.takeSnap(page, "homepage");
  } finally {
    await page.close();
  }
}

async function runTests() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  try {
    await testExample(browser);
  } finally {
    await browser.close();
  }
}

runTests();

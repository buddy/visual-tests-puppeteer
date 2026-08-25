import VisualTestsPlugin from "@buddy-works/visual-tests-puppeteer";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();

try {
  const page = await browser.newPage();
  try {
    await page.goto("https://buddy.works");

    await page.waitForSelector("h1", { visible: true });

    const visualTests = new VisualTestsPlugin();
    await visualTests.takeSnap(page, "homepage");
  } finally {
    await page.close();
  }
} finally {
  await browser.close();
}

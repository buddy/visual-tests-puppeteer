import { Page } from "puppeteer";
import { SnapshotOptions, Snapshot } from "./types";
import { Cookie } from "puppeteer";

type GlobalThis = {
  SNAPSHOT: {
    parseDom: (
      document: Document,
      jsEnabled?: boolean,
    ) => {
      title: string;
      html: string;
      resources: Array<{ url: string; type: string }>;
    };
  };
};
/**
 * Plugin for capturing snapshots of web pages for visual testing.
 */
export class VisualTestsPlugin {
  private suppressErrors: boolean;
  private parseDomScript?: string;

  /**
   * Creates a new instance of VisualTestsPlugin
   * @param {boolean} [suppressErrors=true] - Whether to suppress errors from plugin methods
   */
  constructor(suppressErrors = true) {
    this.suppressErrors = suppressErrors;
  }

  /**
   * Fetches and caches the parseDom script
   * @private
   * @returns {Promise<void>}
   */
  private async fetchParseDom(): Promise<void> {
    if (this.parseDomScript) return;

    try {
      const response = await fetch("http://localhost:1337/parseDom.js");
      if (!response.ok) {
        throw new Error(`Failed to fetch parseDom.js: ${response.status}`);
      }
      this.parseDomScript = await response.text();
    } catch (error) {
      if (!this.suppressErrors) {
        const error_ =
          error instanceof Error
            ? new Error(`Failed to fetch parseDom.js: ${error.message}`)
            : new Error(`Failed to fetch parseDom.js: ${String(error)}`);
        throw error_;
      }
    }
  }

  /**
   * Takes a snapshot of the current page
   * @param {Page} page - The Puppeteer page instance
   * @param {string} name - The name of the snapshot
   * @param {SnapshotOptions} [options={}] - The snapshot options
   * @returns {Promise<Snapshot|void>} The snapshot data or void if suppressed error occurred
   * @throws {Error} When name is not provided or is not a string
   * @throws {Error} When parseDom.js fails to load and suppressErrors is false
   * @throws {Error} When snapshot fails to be sent to server
   */
  async takeSnap(
    page: Page,
    name: string,
    {
      devices,
      fullPage,
      colorScheme,
      enableJavaScript,
      injectStyles,
      resourceDiscoveryTimeout,
      cloneCookies,
      cssIgnores,
      xpathIgnores,
    }: SnapshotOptions = {},
  ): Promise<Snapshot | void> {
    if (!name || typeof name !== "string") {
      throw new Error("Snapshot name is required and must be a string");
    }

    await this.fetchParseDom();

    if (!this.parseDomScript && this.suppressErrors) {
      return;
    }

    const isScriptInjected = await page.evaluate(() => {
      return (globalThis as unknown as GlobalThis).SNAPSHOT !== undefined;
    });

    if (!isScriptInjected) {
      await page.evaluate(this.parseDomScript!);
    }

    const url = page.url();

    let cookies: Cookie[] = [];
    if (cloneCookies) {
      const browser = page.browser();
      cookies = await browser.cookies();
    }

    const { title, html, resources } = await page.evaluate((jsEnabled) => {
      return (globalThis as unknown as GlobalThis).SNAPSHOT.parseDom(
        document,
        jsEnabled,
      );
    }, enableJavaScript);

    const snapshot: Snapshot = {
      name,
      url,
      title,
      html,
      resources,
      devices,
      colorScheme,
      fullPage,
      enableJavaScript,
      injectStyles,
      resourceDiscoveryTimeout,
      cookies,
      cssIgnores,
      xpathIgnores,
      version: 1,
    };

    const response = await fetch("http://localhost:1337/snapshot", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(snapshot),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return snapshot;
  }
}

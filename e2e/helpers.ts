import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/** Assert the primary content landmark is visible (avoids strict-mode body+main clash). */
export async function expectMainVisible(page: Page) {
  await expect(page.locator("#main, main").first()).toBeVisible();
}

export function urlHasRedirect(path: string, pageUrl: string): boolean {
  try {
    const u = new URL(pageUrl);
    const redirect = u.searchParams.get("redirect") ?? "";
    return redirect === path || decodeURIComponent(redirect) === path;
  } catch {
    return pageUrl.includes(`redirect=${encodeURIComponent(path)}`) || pageUrl.includes(`redirect=${path}`);
  }
}

import { expect, test } from "@playwright/test";

test.describe("Home", () => {
  test("renders the editorial hero and real project links immediately", async ({
    page,
  }) => {
    const siteContent = page.waitForResponse((response) =>
      response.url().endsWith("/api/site"),
    );
    await page.goto("/");

    expect((await siteContent).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { level: 1, name: /arthur iarley/i }),
    ).toBeVisible();
    await expect(page.locator(".preloader")).toHaveCount(0);
    await expect(page.locator("#projetos a[target='_blank']")).toHaveCount(4);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("keeps the core portfolio content visible", async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("heading", { level: 1, name: /arthur iarley/i }),
      ).toBeVisible();
      await expect(page.locator("#projetos")).toBeVisible();
    });
  });

  test.describe("reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("removes scroll-driven movement without hiding content", async ({
      page,
    }) => {
      await page.goto("/");

      const revealAnimation = await page
        .locator(".reveal-block")
        .first()
        .evaluate((element) => getComputedStyle(element).animationName);

      expect(revealAnimation).toBe("none");
      await expect(page.locator("h1")).toBeVisible();
    });
  });
});

test.describe("Navbar", () => {
  test("mobile menu opens, locks scroll and closes with Escape", async ({
    page,
    viewport,
  }) => {
    test.skip(!viewport || viewport.width > 767, "Mobile only");
    await page.goto("/");

    const menuButton = page.getByLabel("Abrir menu");
    await menuButton.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).toBeHidden();
    await expect(menuButton).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).toBe("");
  });
});

// Runs on both projects (desktop + Pixel 7) on purpose: mobile must get the
// intro too. If this ever starts passing only on desktop, a skip crept into
// INTRO_SKIP_QUERY — touch and narrow viewports are not skip reasons.
test("Manim intro lands on the header and releases the hero", async ({ page }) => {
  await page.goto("/");
  const intro = page.locator("[data-site-intro]");
  await expect(intro).toBeVisible();
  await expect(intro).toBeHidden({ timeout: 5000 });
  await expect(page.locator("[data-header-mark]")).toHaveCSS("opacity", "1");
  await expect(page.locator("h1")).toBeVisible();
});

test("intro skips reduced motion and recovers from missing media", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-site-intro]")).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/animations/terminal-intro.mp4", route => route.abort());
  await page.reload();
  await expect(page.locator("[data-site-intro]")).toBeHidden();
  await expect(page.locator("[data-header-mark]")).toHaveCSS("opacity", "1");
});

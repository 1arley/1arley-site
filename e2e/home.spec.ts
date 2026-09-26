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

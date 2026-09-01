import { test, expect } from '@playwright/test'

test.describe('Preloader', () => {
  test('preloader oculto, hero visível', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.preloader')).toBeHidden()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('desktop: stroke-draw desenha o wordmark e sai', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Só desktop')
    await page.goto('/')

    const path = page.locator('.preloader svg path').first()
    await expect(path).toHaveAttribute('stroke-dasharray', '1 1')
    await expect(path).toHaveAttribute('pathLength', '1')

    await expect.poll(() => path.evaluate(el => el.getAttribute('stroke-dashoffset'))).toBe('0')
    await expect.poll(() => path.evaluate(el => getComputedStyle(el).fillOpacity)).toBe('1')

    await expect(page.locator('.preloader')).toBeHidden()
    await expect(page.locator('h1')).toBeVisible()
  })

  test.describe('sem JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('mobile: CSS display none oculta preloader server-rendered', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Só mobile')
      await page.goto('/')
      await expect(page.locator('.preloader')).toBeHidden()
      const display = await page.locator('.preloader').evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('none')
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('reduced motion, sem JavaScript', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' }, javaScriptEnabled: false })

    test('desktop: CSS display none (F003)', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Só desktop')
      await page.goto('/')
      await expect(page.locator('.preloader')).toBeHidden()
      const display = await page.locator('.preloader').evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('none')
      await expect(page.locator('h1')).toBeVisible()
    })
  })
})

test.describe('Navbar', () => {
  test('mobile: menu abre/fecha com scroll-lock', async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width > 767, 'Só mobile')
    await page.goto('/')

    const menuBtn = page.getByLabel('Abrir menu')
    await menuBtn.click()

    await expect(page.locator('[role="dialog"]')).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.style.overflow)
    expect(overflow).toBe('hidden')

    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).toBeHidden()
    const overflowAfter = await page.evaluate(() => document.documentElement.style.overflow)
    expect(overflowAfter).toBe('')
  })
})
import { test, expect } from '@playwright/test'

test.describe('Preloader', () => {
  test('desktop: abre com wordmark, honesta e sai', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Só desktop')
    await page.goto('/')

    const frame = page.locator('.preloader')
    await expect(frame).toBeVisible()
    await expect(frame).toContainText(/arthur/i)
    await expect(frame).toContainText(/iarley/i)
    await expect(frame).toContainText('RECIFE')

    // A cortina deve sumir sozinha após o gate de prontidão (min floor + cap).
    await expect(frame).toBeHidden({ timeout: 6000 })
    await expect(page.locator('h1')).toBeVisible()
  })

  test('desktop: toca a cada visita (recarrega de novo)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Só desktop')
    await page.goto('/')
    await expect(page.locator('.preloader')).toBeHidden({ timeout: 6000 })

    // Recarregar deve tocar a abertura de novo (sem flag persistido).
    await page.reload()
    await expect(page.locator('.preloader')).toBeVisible()
    await expect(page.locator('.preloader')).toBeHidden({ timeout: 6000 })
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

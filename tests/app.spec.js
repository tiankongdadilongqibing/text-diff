import { test, expect } from '@playwright/test'

test.describe('富文本对比技术演示', () => {
  test('页面标题正确显示', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('富文本对比技术演示')
    await expect(page.locator('h1')).toContainText('富文本对比技术演示')
  })

  test('默认显示 diff-match-patch 标签页', async ({ page }) => {
    await page.goto('/')
    const defaultTab = page.getByRole('button', { name: 'diff-match-patch', exact: true })
    await expect(defaultTab).toHaveClass(/active/)
  })

  test('页面描述文字正确显示', async ({ page }) => {
    await page.goto('/')
    const description = page.locator('.header p')
    await expect(description).toContainText('富文本对比前端技术方案')
  })
})

import { test, expect } from '@playwright/test';

test('Pricing page loads correctly and shows all plans', async ({ page }) => {
  // Navigate to the local server (we'll assume it's running on port 5173)
  await page.goto('http://localhost:5173');

  // Check that the page title is correct
  await expect(page).toHaveTitle('定价方案');

  // Check that the main heading is present
  await expect(page.getByText('选择适合您的定价方案')).toBeVisible();

  // Check that all three pricing plans are present
  const pricingCards = page.locator('.pricing-card');
  await expect(pricingCards).toHaveCount(3);

  // Check that the popular plan is labeled as such
  await expect(page.getByText('最受欢迎')).toBeVisible();

  // Check that each plan has a name, price, and CTA button
  for (const plan of ['基础版', '专业版', '企业版']) {
    await expect(page.getByText(plan)).toBeVisible();
  }

  for (const price of ['99', '299', '899']) {
    await expect(page.getByText(price, { exact: true })).toBeVisible();
  }

  const ctaButtons = page.locator('.cta-button');
  await expect(ctaButtons).toHaveCount(3);
});

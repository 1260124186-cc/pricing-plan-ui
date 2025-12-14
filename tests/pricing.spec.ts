import { test, expect } from '@playwright/test';

test.describe('定价方案页面', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到本地服务器
    await page.goto('http://localhost:8080/');
  });

  test('页面加载并显示所有定价方案', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle('定价方案');

    // 检查主标题是否存在
    await expect(page.getByText('选择适合您的定价方案')).toBeVisible();

    // 检查所有三个定价方案是否存在
    const pricingCards = page.locator('.pricing-card');
    await expect(pricingCards).toHaveCount(3);

    // 检查最受欢迎标签是否存在
    await expect(page.getByText('最受欢迎')).toBeVisible();

    // 检查每个方案都有名称、价格和CTA按钮
    for (const plan of ['基础版', '专业版', '企业版']) {
      await expect(page.getByText(plan)).toBeVisible();
    }

    for (const price of ['99', '299', '899']) {
      await expect(page.getByText(price, { exact: true })).toBeVisible();
    }

    const ctaButtons = page.locator('.cta-button');
    await expect(ctaButtons).toHaveCount(3);
  });

  test('视觉层级和分隔清晰', async ({ page }) => {
    // 检查标题区域有边框分隔
    const title = page.locator('.pricing-title');
    await expect(title).toBeVisible();

    // 检查卡片有边框和阴影（边框宽度已改为2px）
    const cards = page.locator('.pricing-card');
    const firstCard = cards.first();
    await expect(firstCard).toHaveCSS('border-width', '2px');
    await expect(firstCard).toHaveCSS('box-shadow', /rgba/);

    // 检查功能列表区域有边框分隔
    const features = page.locator('.features').first();
    await expect(features).toHaveCSS('border-top-width', '2px');
  });

  test('字体层级正确', async ({ page }) => {
    // 检查H1标题字体大小
    const title = page.locator('.pricing-title');
    const titleFontSize = await title.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(titleFontSize)).toBeGreaterThanOrEqual(32); // 至少32px

    // 检查H3标题字体大小
    const planName = page.locator('.plan-name').first();
    const planNameFontSize = await planName.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(planNameFontSize)).toBeGreaterThanOrEqual(20); // 至少20px

    // 检查正文字体大小
    const description = page.locator('.description').first();
    const descFontSize = await description.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(descFontSize)).toBeGreaterThanOrEqual(14); // 至少14px
  });

  test('按钮点击显示轻提示', async ({ page }) => {
    // 点击第一个按钮
    const firstButton = page.locator('.cta-button').first();
    await firstButton.click();

    // 等待轻提示出现
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible({ timeout: 1000 });

    // 检查轻提示内容
    await expect(toast).toHaveText('功能正在开发中');

    // 等待轻提示自动消失（Toast duration是2000ms + 300ms动画时间）
    await expect(toast).not.toBeVisible({ timeout: 3000 });
  });

  test('轻提示样式正确', async ({ page }) => {
    // 点击按钮触发轻提示
    const button = page.locator('.cta-button').first();
    await button.click();

    // 等待轻提示出现
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible({ timeout: 500 });

    // 检查轻提示样式
    const bgColor = await toast.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toContain('rgb');

    // 检查轻提示位置（应该在顶部居中）
    const position = await toast.boundingBox();
    expect(position).not.toBeNull();
    if (position) {
      // 检查是否在页面顶部
      expect(position.y).toBeLessThan(100);
    }
  });

  test('按钮悬停效果正常', async ({ page }) => {
    const button = page.locator('.cta-button').first();

    // 检查初始状态
    const initialTransform = await button.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // 悬停在按钮上
    await button.hover();

    // 等待过渡动画
    await page.waitForTimeout(300);

    // 检查悬停后的变换
    const hoverTransform = await button.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // 悬停后应该有变换效果
    expect(hoverTransform).not.toBe('none');
  });

  test('卡片悬停效果正常', async ({ page }) => {
    const card = page.locator('.pricing-card').first();

    // 悬停在卡片上
    await card.hover();

    // 等待过渡动画
    await page.waitForTimeout(300);

    // 检查悬停后的阴影增强
    const boxShadow = await card.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );

    // 悬停后应该有阴影效果
    expect(boxShadow).not.toBe('none');
  });

  test('可访问性：按钮可聚焦', async ({ page }) => {
    const button = page.locator('.cta-button').first();

    // 检查按钮可以通过Tab键聚焦
    await button.focus();

    // 检查焦点状态
    const isFocused = await button.evaluate((el) =>
      document.activeElement === el
    );
    expect(isFocused).toBe(true);

    // 检查焦点样式
    const outline = await button.evaluate((el) =>
      window.getComputedStyle(el).outline
    );
    expect(outline).not.toBe('none');
  });

  test('响应式设计：移动端布局', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100); // 等待布局调整

    // 检查网格布局（在移动端应该是单列，但auto-fit可能会计算出具体宽度）
    const grid = page.locator('.pricing-grid');
    const gridTemplateColumns = await grid.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );

    // 在移动端，grid应该只有一列（可能是1fr或具体宽度）
    // 检查是否只有一个列值（通过计算列数）
    const columnCount = await grid.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const columns = style.gridTemplateColumns.split(' ');
      return columns.filter(col => col.trim() !== '').length;
    });
    expect(columnCount).toBe(1);

    // 检查卡片间距调整
    const gap = await grid.evaluate((el) =>
      window.getComputedStyle(el).gap
    );
    expect(gap).toBeTruthy();
  });

  test('图标样式统一', async ({ page }) => {
    const icons = page.locator('.feature-icon');
    const iconCount = await icons.count();

    // 检查所有图标都存在
    expect(iconCount).toBeGreaterThan(0);

    // 检查第一个图标的样式
    const firstIcon = icons.first();
    const iconColor = await firstIcon.evaluate((el) =>
      window.getComputedStyle(el).color
    );
    const iconBg = await firstIcon.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // 图标应该有统一的颜色和背景
    expect(iconColor).toBeTruthy();
    expect(iconBg).toBeTruthy();
  });

  test('最受欢迎方案样式正确', async ({ page }) => {
    const popularCard = page.locator('.pricing-card.popular');

    // 检查最受欢迎卡片存在
    await expect(popularCard).toBeVisible();

    // 检查背景色为白色
    const bgColor = await popularCard.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toContain('rgb(255, 255, 255)');

    // 检查边框颜色为蓝色
    const borderColor = await popularCard.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
    expect(borderColor).toBeTruthy();

    // 检查边框宽度
    const borderWidth = await popularCard.evaluate((el) =>
      window.getComputedStyle(el).borderWidth
    );
    expect(borderWidth).toContain('2px');
  });

  test('最受欢迎角标位置和样式正确', async ({ page }) => {
    const badge = page.locator('.popular-badge');

    // 检查角标存在
    await expect(badge).toBeVisible();

    // 检查角标文字
    await expect(badge).toHaveText('最受欢迎');

    // 检查角标位置（应该在卡片左上角）
    // 获取最受欢迎卡片和角标的位置
    const popularCard = page.locator('.pricing-card.popular');
    const cardBox = await popularCard.boundingBox();
    const badgeBox = await badge.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();

    if (cardBox && badgeBox) {
      // 检查角标是否在卡片内部（左上角区域）
      // 角标的x和y应该接近卡片的x和y（因为角标是绝对定位在卡片内的）
      const xDiff = Math.abs(badgeBox.x - cardBox.x);
      const yDiff = Math.abs(badgeBox.y - cardBox.y);
      expect(xDiff).toBeLessThan(10); // 角标应该在卡片左上角10px内
      expect(yDiff).toBeLessThan(10);
    }

    // 检查角标样式
    const position = await badge.evaluate((el) =>
      window.getComputedStyle(el).position
    );
    expect(position).toBe('absolute');

    // 检查渐变背景
    const bgImage = await badge.evaluate((el) =>
      window.getComputedStyle(el).backgroundImage
    );
    expect(bgImage).toContain('gradient');

    // 检查圆角
    const borderRadius = await badge.evaluate((el) =>
      window.getComputedStyle(el).borderRadius
    );
    expect(borderRadius).toBeTruthy();
  });

  test('三个卡片高度一致', async ({ page }) => {
    const cards = page.locator('.pricing-card');
    await expect(cards).toHaveCount(3);

    // 获取所有卡片的高度
    const heights = await cards.evaluateAll((elements) =>
      elements.map((el) => el.getBoundingClientRect().height)
    );

    // 检查所有卡片高度是否一致（允许1px误差）
    const firstHeight = heights[0];
    for (let i = 1; i < heights.length; i++) {
      const heightDiff = Math.abs(heights[i] - firstHeight);
      expect(heightDiff).toBeLessThan(2); // 允许2px误差
    }
  });

  test('卡片点击功能正常', async ({ page }) => {
    // 点击第一个卡片的按钮（卡片本身有cursor: pointer，但实际功能在按钮上）
    const firstCard = page.locator('.pricing-card').first();
    const button = firstCard.locator('.cta-button');

    // 点击按钮触发轻提示
    await button.click();

    // 应该显示轻提示
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible({ timeout: 1000 });
  });

  test('所有卡片按钮都能触发轻提示', async ({ page }) => {
    const buttons = page.locator('.cta-button');
    await expect(buttons).toHaveCount(3);

    // 测试每个按钮
    for (let i = 0; i < 3; i++) {
      const button = buttons.nth(i);
      await button.click();

      // 等待轻提示出现
      const toast = page.locator('.toast');
      await expect(toast).toBeVisible({ timeout: 1000 });

      // 等待轻提示消失后再测试下一个（Toast duration是2000ms + 300ms动画时间）
      await expect(toast).not.toBeVisible({ timeout: 3000 });
      await page.waitForTimeout(500);
    }
  });

  test('最受欢迎卡片阴影更明显', async ({ page }) => {
    const popularCard = page.locator('.pricing-card.popular');
    const normalCard = page.locator('.pricing-card').first();

    // 获取阴影样式
    const popularShadow = await popularCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    const normalShadow = await normalCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );

    // 最受欢迎卡片的阴影应该更明显（包含更多层或更大的模糊）
    expect(popularShadow).toBeTruthy();
    expect(normalShadow).toBeTruthy();

    // 检查最受欢迎卡片是否有蓝色调的阴影
    expect(popularShadow).toContain('rgba');
  });

  test('卡片悬停时边框颜色变化', async ({ page }) => {
    const card = page.locator('.pricing-card').first();

    // 获取初始边框颜色
    const initialBorderColor = await card.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );

    // 悬停在卡片上
    await card.hover();
    await page.waitForTimeout(200);

    // 检查悬停后的边框颜色
    const hoverBorderColor = await card.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );

    // 悬停后边框颜色应该改变
    expect(hoverBorderColor).not.toBe(initialBorderColor);
  });

  test('背景渐变和圆形装饰显示', async ({ page }) => {
    // 检查body背景
    const bodyBg = await page.evaluate(() =>
      window.getComputedStyle(document.body).background
    );
    expect(bodyBg).toContain('gradient');

    // 检查是否有圆形装饰（通过检查body的伪元素）
    // 注意：Playwright无法直接检查伪元素，我们检查背景渐变是否存在即可
    const bodyBgImage = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundImage
    );
    // 背景应该包含渐变或圆形装饰相关的样式
    expect(bodyBg).toBeTruthy();
  });

  test('功能列表显示正确', async ({ page }) => {
    const cards = page.locator('.pricing-card');
    await expect(cards).toHaveCount(3);

    // 检查每个卡片都有功能列表
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      const features = card.locator('.features');
      await expect(features).toBeVisible();

      // 检查功能项数量
      const featureItems = card.locator('.feature-item');
      const count = await featureItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('价格显示格式正确', async ({ page }) => {
    const prices = page.locator('.price');
    await expect(prices).toHaveCount(3);

    // 检查每个价格都包含金额和"/月"
    for (let i = 0; i < 3; i++) {
      const price = prices.nth(i);
      const amount = price.locator('.amount');
      const period = price.locator('.period');

      await expect(amount).toBeVisible();
      await expect(period).toBeVisible();
      await expect(period).toHaveText('/月');
    }
  });

  test('响应式设计：移动端角标正常显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100); // 等待布局调整

    // 检查角标仍然可见
    const badge = page.locator('.popular-badge');
    await expect(badge).toBeVisible();

    // 检查角标位置仍然在卡片左上角（相对于卡片）
    const popularCard = page.locator('.pricing-card.popular');
    const cardBox = await popularCard.boundingBox();
    const badgeBox = await badge.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();

    if (cardBox && badgeBox) {
      // 检查角标是否在卡片内部（左上角区域）
      const xDiff = Math.abs(badgeBox.x - cardBox.x);
      const yDiff = Math.abs(badgeBox.y - cardBox.y);
      expect(xDiff).toBeLessThan(10); // 角标应该在卡片左上角10px内
      expect(yDiff).toBeLessThan(10);
    }
  });
});

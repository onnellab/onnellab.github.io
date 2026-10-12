import { expect, test } from '@playwright/test';

const routes = [
  { home: '/', segment: '', title: 'Small tools. Calmly made.', apps: '/apps/', about: '/about/', blog: '/blog/' },
  { home: '/ko/', segment: 'ko/', title: '작은 도구를, 세심하게 만들어요.', apps: '/apps/ko/', about: '/about/ko/', blog: '/blog/ko/' },
  { home: '/ja/', segment: 'ja/', title: '小さな道具を、丁寧に。', apps: '/apps/ja/', about: '/about/ja/', blog: '/blog/ja/' },
  { home: '/zh-hans/', segment: 'zh-hans/', title: '小工具，用心做。', apps: '/apps/zh-hans/', about: '/about/zh-hans/', blog: '/blog/zh-hans/' },
  { home: '/zh-hant/', segment: 'zh-hant/', title: '小工具，用心做。', apps: '/apps/zh-hant/', about: '/about/zh-hant/', blog: '/blog/zh-hant/' },
  { home: '/pt-br/', segment: 'pt-br/', title: 'Ferramentas pequenas. Feitas com cuidado.', apps: '/apps/pt-br/', about: '/about/pt-br/', blog: '/blog/pt-br/' },
  { home: '/de/', segment: 'de/', title: 'Kleine Werkzeuge. Mit Sorgfalt gemacht.', apps: '/apps/de/', about: '/about/de/', blog: '/blog/de/' },
  { home: '/fr/', segment: 'fr/', title: 'De petits outils, conçus avec soin.', apps: '/apps/fr/', about: '/about/fr/', blog: '/blog/fr/' },
  { home: '/es/', segment: 'es/', title: 'Herramientas pequeñas, hechas con cuidado.', apps: '/apps/es/', about: '/about/es/', blog: '/blog/es/' }
] as const;

test('compact home keeps product discovery, trust, and all nine localized routes', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.home);
    await expect(page.locator('h1')).toContainText(route.title);
    await expect(page.locator('.brand-lockup .brand-symbol')).toBeVisible();
    await expect(page.locator('.brand-lockup span')).toHaveText('ONNELLAB');
    await expect(page.locator('.nav-links a')).toHaveCount(3);
    await expect(page.locator(`.nav-links a[href="${route.apps}"]`)).toHaveCount(1);
    await expect(page.locator(`.nav-links a[href="${route.about}"]`)).toHaveCount(1);
    await expect(page.locator(`.nav-links a[href="${route.blog}"]`)).toHaveCount(1);
    await expect(page.locator('.locale-menu summary')).toHaveCount(1);
    await expect(page.locator('a.featured')).toHaveAttribute('href', `/apps/tagweaver/${route.segment}`);
    await expect(page.locator('.product-card h3')).toHaveText(['Quivra', 'Melivra', 'Papira']);
    await expect(page.locator('.trust-ordinal')).toHaveText(['01', '02', '03']);
    await expect(page.locator('.trust-count')).toHaveCount(0);
    await expect(page.locator('.trust-principles, .trust-principle')).toHaveCount(0);
    for (const removed of ['.workflow-section', '.updates-section', '.values-section', '.closing-section', '.trust-note']) {
      await expect(page.locator(removed)).toHaveCount(0);
    }
    await expect(page.locator('.home-hero .primary-link')).toHaveAttribute('href', route.apps);
    await expect(page.locator('main')).not.toContainText('여름 소리 만들기');
    await expect(page.locator('main')).not.toContainText('가상 고객 사례');
  }
});

test('the logo is cropped from the existing favicon without replacing it', async ({ page, request }) => {
  const symbol = await request.get('/brand/onnellab-symbol.svg');
  const favicon = await request.get('/favicon.svg');
  expect(symbol.ok()).toBe(true);
  expect(favicon.ok()).toBe(true);
  expect(await symbol.text()).toContain('viewBox="196 273 900 673"');
  expect(await favicon.text()).toContain('viewBox="0 0 1254 1254"');

  await page.goto('/');
  const logo = page.locator('.brand-symbol');
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test('the home uses original localized UI captures rather than store composites', async ({ page, request }) => {
  await page.goto('/ko/');
  const sources = await page.locator('.hero-slide-screen img, .featured-screen img, .product-screen img')
    .evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).getAttribute('src')));
  expect(sources).toHaveLength(7);
  for (const src of sources) {
    expect(src).toContain('/home-assets/screenshots/android-20261012/ko/');
    const response = await request.get(src!);
    expect(response.status(), src!).toBe(200);
    expect(response.headers()['content-type'], src!).toContain('image/png');
    const bytes = await response.body();
    expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect(bytes.readUInt32BE(16), src!).toBeGreaterThanOrEqual(1080);
    expect(bytes.readUInt32BE(20), src!).toBeGreaterThanOrEqual(1920);
  }
  const icon = page.locator('.product-identity img');
  await expect(icon).toHaveAttribute('src', '/home-assets/app-icons/tagweaver-96.webp');
  await expect(icon).toHaveAttribute('srcset', /tagweaver-192.webp/);
  await expect(page.locator('.featured .text-arrow')).toContainText('TagWeaver');
});

test('mobile navigation, first viewport, and nine-language layout remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route.home);
    const nav = page.locator('.top-nav');
    await expect(nav.locator('.brand-lockup')).toBeVisible();
    await expect(nav.locator('.mobile-menu summary')).toBeVisible();
    await expect(nav.locator('.locale-menu summary')).toBeVisible();
    await nav.locator('.mobile-menu summary').click();
    await expect(nav.locator(`.mobile-menu-panel a[href="${route.about}"]`)).toBeVisible();
    await nav.locator('.mobile-menu summary').click();
    const stage = await page.locator('.hero-slide').first().boundingBox();
    expect(stage, route.home).not.toBeNull();
    expect(stage!.y, route.home).toBeLessThan(844);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route.home).toBeLessThanOrEqual(1);
  }
});

test('home remains free of horizontal overflow at small mobile widths', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const home of ['/ko/', '/ja/', '/zh-hans/', '/zh-hant/', '/pt-br/', '/de/', '/fr/', '/es/']) {
    await page.goto(home);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, home).toBeLessThanOrEqual(1);
  }
});

test('the condensed home ends with transparent trust and a useful footer', async ({ page }) => {
  await page.goto('/ko/');
  await expect(page.locator('.trust-grid .trust-item')).toHaveCount(3);
  await expect(page.locator('.trust-principles, .trust-principle')).toHaveCount(0);
  await expect(page.locator('.footer-directory')).toHaveCount(0);
  await expect(page.locator('[data-site-header] .nav-links > a')).toHaveCount(3);
  await expect(page.locator('footer.site-footer')).toHaveCount(1);
  await expect(page.locator('.closing-section, .workflow-section, .values-section, .updates-section')).toHaveCount(0);
  await expect(page.locator('.home-hero .primary-link')).toHaveCount(1);
});

test('all nine homepage locales use matching uncompressed original UI captures', async ({ page, request }) => {
  const localeMap: Record<string, string> = {
    'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant', 'pt-br': 'pt-BR'
  };
  for (const route of routes) {
    await page.goto(route.home);
    const paths = await page.locator('.hero-slide-screen img, .featured-screen img, .product-screen img')
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLImageElement).getAttribute('src')));
    expect(paths).toHaveLength(7);
    const uniquePaths = [...new Set(paths)];
    expect(uniquePaths).toHaveLength(5);
    const segment = route.segment ? route.segment.slice(0, -1) : 'en';
    const assetLocale = localeMap[segment] ?? segment;
    for (const source of uniquePaths) {
      expect(source).toContain('/home-assets/screenshots/android-20261012/' + assetLocale + '/');
      expect((await request.get(source!)).status(), source!).toBe(200);
    }
  }
});

test('selected product originals load sharply when scrolled into view', async ({ page }) => {
  await page.goto('/ko/');
  const pictures = page.locator('.product-screen img');
  await expect(pictures).toHaveCount(3);
  for (const picture of await pictures.all()) {
    await picture.scrollIntoViewIfNeeded();
    await expect.poll(async () => picture.evaluate((img) =>
      (img as HTMLImageElement).complete ? (img as HTMLImageElement).naturalWidth : 0
    )).toBeGreaterThanOrEqual(1080);
  }
});

test('all three Android cards are fully visible with a large center at four widths', async ({ page }) => {
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const result = await page.locator('.hero-stage').evaluate(async (track) => {
      const links = [...track.querySelectorAll<HTMLAnchorElement>('a.hero-slide')];
      await Promise.all(links.map(async (link) => {
        const img = link.querySelector('.hero-slide-screen img') as HTMLImageElement;
        await img.decode();
      }));
      const outer = track.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        innerScroll: track.scrollWidth - track.clientWidth,
        cards: links.map((link) => {
          const img = link.querySelector('.hero-slide-screen img') as HTMLImageElement;
          const rect = link.getBoundingClientRect();
          return {
            name: link.querySelector('.hero-slide-identity strong')?.textContent,
            position: link.dataset.position,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            withinStage: rect.left >= outer.left - 1 && rect.right <= outer.right + 1,
            objectFit: getComputedStyle(img).objectFit,
            native: [img.naturalWidth, img.naturalHeight],
            src: img.getAttribute('src')
          };
        })
      };
    });
    expect(result.overflow, String(width)).toBeLessThanOrEqual(1);
    expect(result.innerScroll, 'no half-visible scrolling on ' + width).toBeLessThanOrEqual(1);
    expect(result.cards).toHaveLength(3);
    expect(result.cards.map((item) => item.position)).toEqual(['active', 'next', 'previous']);
    for (const frame of result.cards) {
      expect(frame.withinStage, frame.name + ' at ' + width).toBe(true);
      expect(frame.src).toContain('/home-assets/screenshots/android-20261012/ko/');
      expect(frame.objectFit).toBe('contain');
      expect(frame.native[0]).toBeGreaterThanOrEqual(1080);
      expect(frame.native[1]).toBeGreaterThanOrEqual(2400);
      expect(frame.width, frame.name).toBeGreaterThan(45);
    }
    const middle = result.cards.find((x) => x.position === 'active')!;
    expect(middle.name).toBe('TagWeaver');
    // Restore the first design's approximately 31 / 40 / 29 width proportions.
    const leftCard = result.cards.find((x) => x.position === 'previous')!;
    const rightCard = result.cards.find((x) => x.position === 'next')!;
    expect(middle.width / leftCard.width).toBeGreaterThan(1.25);
    expect(middle.width / leftCard.width).toBeLessThan(1.4);
    expect(middle.width / rightCard.width).toBeGreaterThan(1.3);
    expect(middle.width / rightCard.width).toBeLessThan(1.5);
    expect(result.cards.find((x) => x.position === 'previous')!.left)
      .toBeLessThan(middle.left);
    expect(result.cards.find((x) => x.position === 'next')!.left)
      .toBeGreaterThan(middle.left);
  }
});

test('carousel arrows, dots and keyboard rotate the central card continuously', async ({ page }) => {
  await page.goto('/ko/');
  const carousel = page.locator('[data-hero-carousel]');
  const dots = carousel.locator('[data-hero-dot]');
  const next = carousel.locator('[data-hero-next]');
  const previous = carousel.locator('[data-hero-previous]');
  const track = carousel.locator('[data-hero-track]');
  const counter = carousel.locator('[data-hero-counter]');
  const center = carousel.locator('.hero-slide[data-position="active"] .hero-slide-identity strong');
  await expect(carousel.locator('.hero-slide-identity strong')).toHaveText(['TagWeaver', 'Melivra', 'Papira']);
  await expect(carousel.locator('.hero-slide-identity small')).toHaveText([
    '음악 태그 편집', '로컬 음악 플레이어', '전자책 만들기'
  ]);
  await expect(dots).toHaveCount(3);
  await expect(counter).toHaveText('01 / 03');
  await expect(center).toHaveText('TagWeaver');
  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');

  await next.click();
  await expect(center).toHaveText('Melivra');
  await expect(counter).toHaveText('02 / 03');
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await next.click();
  await expect(center).toHaveText('Papira');
  await expect(counter).toHaveText('03 / 03');
  await next.click();
  await expect(center).toHaveText('TagWeaver');
  await expect(counter).toHaveText('01 / 03');
  await previous.click();
  await expect(center).toHaveText('Papira');
  await expect(counter).toHaveText('03 / 03');

  await dots.nth(1).click();
  await expect(center).toHaveText('Melivra');
  await track.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(center).toHaveText('TagWeaver');
  await page.keyboard.press('ArrowRight');
  await expect(center).toHaveText('Melivra');
});

test('centered rotation works on mobile with fully visible side cards and links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ko/');
  const stage = page.locator('[data-hero-track]');
  const first = page.locator('.hero-slide[data-index="0"]');
  const second = page.locator('.hero-slide[data-index="1"]');
  const third = page.locator('.hero-slide[data-index="2"]');
  await expect(first).toHaveAttribute('data-position', 'active');
  await expect(second).toHaveAttribute('data-position', 'next');
  await expect(third).toHaveAttribute('data-position', 'previous');
  await page.locator('[data-hero-next]').click();
  await expect(second).toHaveAttribute('data-position', 'active');
  await expect(first).toHaveAttribute('data-position', 'previous');
  await expect(third).toHaveAttribute('data-position', 'next');
  const inside = await stage.evaluate((container) => {
    const bounds = container.getBoundingClientRect();
    return [...container.querySelectorAll('.hero-slide')].every((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= bounds.left - 1 && r.right <= bounds.right + 1;
    });
  });
  expect(inside).toBe(true);
  await expect(second).toHaveAttribute('href', '/apps/melivra/ko/');
  await second.click();
  await expect(page).toHaveURL(/\/apps\/melivra\/ko\/$/);
});

test('the homepage uses only Android source dimensions for every product', async ({ page }) => {
  await page.goto('/ko/');
  const images = await page.locator('.hero-slide-screen img, .featured-screen img, .product-screen img')
    .evaluateAll(async (nodes) => {
      const items = nodes as HTMLImageElement[];
      await Promise.all(items.map(async (img) => {
        await img.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
        await img.decode();
      }));
      return items.map((img) => ({
        name: img.getAttribute('src')?.split('/').pop(),
        size: [img.naturalWidth, img.naturalHeight]
      }));
    });
  const dimensions: Record<string, number[]> = {
    'tagweaver-library.png': [1440, 3120],
    'tagweaver-editor.png': [1440, 3120],
    'melivra.png': [1080, 2400],
    'papira.png': [1440, 3120],
    'quivra.png': [1080, 1920]
  };
  for (const img of images) expect(img.size, img.name).toEqual(dimensions[img.name!]);
});

test('homepage product colors match the app catalog and Papira is blue', async ({ page }) => {
  const expected = {
    tagweaver: ['#ded2b5', '#fbf7ec', '#6a5a2e'],
    quivra: ['#d7cfdb', '#f4eff5', '#614f68'],
    melivra: ['#f1c8bb', '#fbf2ed', '#6a5148'],
    papira: ['#c2d5e9', '#edf5fd', '#385b78']
  } as const;
  for (const suffix of ['', 'ko/']) {
    await page.goto('/' + suffix);
    const actual = await page.locator('.featured, .collection-grid .product-card').evaluateAll(
      (cards) => cards.map((card) => {
        const style = getComputedStyle(card);
        return {
          slug: (card.getAttribute('href') ?? '').split('/')[2],
          colors: ['--accent-border', '--accent-bg', '--accent-text'].map((property) => style.getPropertyValue(property).trim())
        };
      })
    );
    for (const {slug, colors} of actual) expect(colors, slug).toEqual(expected[slug as keyof typeof expected]);
    for (const item of actual) {
      await page.goto('/apps/' + suffix);
      const appCard = page.locator('.app-card[href="/apps/' + item.slug + '/' + suffix + '"]');
      await expect(appCard).toHaveCount(1);
      const fromCatalog = await appCard.evaluate((node) => {
        const style = getComputedStyle(node);
        return ['--accent-border', '--accent-bg', '--accent-text'].map((property) => style.getPropertyValue(property).trim());
      });
      expect(fromCatalog, item.slug + ': website color must match app listing').toEqual(item.colors);
    }
    await page.goto('/apps/papira/' + suffix);
    const fromDetail = await page.locator('main[data-product-slug="papira"]').evaluate((node) => {
      const style = getComputedStyle(node);
      return ['--accent-border', '--accent-bg', '--accent-text'].map((property) => style.getPropertyValue(property).trim());
    });
    expect(fromDetail).toEqual(expected.papira);
  }
});

test('the center card subtly occludes both complete side previews after every rotation', async ({ page }) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    for (const step of [0, 1, 2]) {
      if (step !== 0) await page.locator('[data-hero-next]').click();
      const result = await page.locator('.hero-stage').evaluate((stage) => {
        const outer = stage.getBoundingClientRect();
        const byPosition = (position: string) =>
          stage.querySelector<HTMLElement>('.hero-slide[data-position="' + position + '"]')!;
        const center = byPosition('active');
        const previous = byPosition('previous');
        const next = byPosition('next');
        const c = center.getBoundingClientRect();
        const p = previous.getBoundingClientRect();
        const n = next.getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          stageOverflow: stage.scrollWidth - stage.clientWidth,
          coveredLeft: p.right - c.left,
          coveredRight: c.right - n.left,
          centerZ: Number(getComputedStyle(center).zIndex),
          prevZ: Number(getComputedStyle(previous).zIndex),
          nextZ: Number(getComputedStyle(next).zIndex),
          allOnStage: [c, p, n].every((r) => r.left >= outer.left - 1 && r.right <= outer.right + 1),
          balancedSizes: c.width > p.width * 1.25 && c.width < p.width * 1.4 && c.width > n.width * 1.3 && c.width < n.width * 1.5
        };
      });
      expect(result.pageOverflow, String(width)).toBeLessThanOrEqual(1);
      expect(result.stageOverflow, String(width)).toBeLessThanOrEqual(1);
      expect(result.allOnStage, 'all cards inside the Hero at ' + width).toBe(true);
      expect(result.balancedSizes).toBe(true);
      const target = width <= 650 ? { min: 21, max: 27 } : { min: 32, max: 40 };
      for (const overlap of [result.coveredLeft, result.coveredRight]) {
        expect(overlap, 'side cards visibly behind center at ' + width).toBeGreaterThan(target.min);
        expect(overlap, 'side card remains recognizable at ' + width).toBeLessThan(target.max);
      }
      expect(result.centerZ).toBeGreaterThan(result.prevZ);
      expect(result.centerZ).toBeGreaterThan(result.nextZ);
    }
  }
});

test('hero screenshots stand alone and every product identity is below its image', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const cards = await page.locator('.hero-slide').evaluateAll((anchors) =>
      anchors.map((anchor) => {
        const screen = anchor.querySelector<HTMLElement>('.hero-slide-screen')!;
        const label = anchor.querySelector<HTMLElement>('.hero-slide-label')!;
        const name = label.querySelector('strong')!;
        const screenRect = screen.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const labelStyle = getComputedStyle(label);
        return {
          name: name.textContent?.trim(),
          visualBelow: labelRect.top - screenRect.bottom,
          labelBackground: labelStyle.backgroundColor,
          labelBorder: labelStyle.borderTopWidth,
          hasOriginalAndroidImage: Boolean(screen.querySelector('img[src*="android-20261012"]'))
        };
      })
    );
    expect(cards.map((card) => card.name)).toEqual(['TagWeaver', 'Melivra', 'Papira']);
    for (const card of cards) {
      expect(card.visualBelow).toBeGreaterThanOrEqual(5);
      expect(card.labelBackground).toBe('rgba(0, 0, 0, 0)');
      expect(card.labelBorder).toBe('0px');
      expect(card.hasOriginalAndroidImage).toBe(true);
    }
  }
});

test('TagWeaver signature identity is prominent without a nested card', async ({ page }) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const badge = page.locator('.featured .product-identity');
    await badge.scrollIntoViewIfNeeded();
    await expect(badge.locator('.product-name')).toHaveText('TagWeaver');
    const metrics = await badge.evaluate((el) => {
      const icon = el.querySelector('img')!;
      const title = el.querySelector('.product-name')!;
      const outer = el.getBoundingClientRect();
      const card = el.closest('.featured')!.getBoundingClientRect();
      const copy = el.closest<HTMLElement>('.featured-copy')!;
      const style = getComputedStyle(copy);
      const availableWidth = copy.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
      return {
        width: outer.width,
        availableWidth,
        height: outer.height,
        iconWidth: icon.getBoundingClientRect().width,
        titleFont: Number.parseFloat(getComputedStyle(title).fontSize),
        withinCard: outer.left >= card.left - 1 && outer.right <= card.right + 1,
        hasOutline: getComputedStyle(el).borderTopStyle === 'solid',
        hasBackground: getComputedStyle(el).backgroundImage !== 'none'
          || getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'
      };
    });
    expect(metrics.width, String(width)).toBeGreaterThanOrEqual(140);
    expect(metrics.width, String(width)).toBeLessThanOrEqual(metrics.availableWidth + 2);
    expect(metrics.height, String(width)).toBeGreaterThanOrEqual(54);
    expect(metrics.iconWidth, String(width)).toBeGreaterThanOrEqual(54);
    expect(metrics.titleFont, String(width)).toBeGreaterThanOrEqual(20);
    expect(metrics.withinCard).toBe(true);
    expect(metrics.hasOutline).toBe(false);
    expect(metrics.hasBackground).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
  }
});

test('signature has no stacked identity card or redundant 01 SIGNATURE ornament', async ({ page }) => {
  await page.goto('/ko/');
  await expect(page.locator('.featured .product-identity')).toHaveCount(1);
  await expect(page.locator('.signature-section .screen-index')).toHaveCount(0);
  const frame = await page.locator('.featured').evaluate((node) => {
    const badge = node.querySelector('.product-identity') as HTMLElement;
    const container = getComputedStyle(node);
    const label = getComputedStyle(badge);
    return {
      outerHasBorder: container.borderTopStyle === 'solid',
      nestedHasBorder: label.borderTopStyle === 'solid',
      nestedBackground: label.backgroundImage,
      nestedColor: label.backgroundColor
    };
  });
  expect(frame.outerHasBorder).toBe(true);
  expect(frame.nestedHasBorder).toBe(false);
  expect(frame.nestedBackground).toBe('none');
  expect(frame.nestedColor).toBe('rgba(0, 0, 0, 0)');
});

test('mobile selected products are compact horizontal cards with original Android screenshots', async ({ page }) => {
  for (const width of [320, 390, 650]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const section = page.locator('.collection-section');
    const cards = section.locator('.product-card');
    await expect(cards).toHaveCount(3);
    const metrics = await cards.evaluateAll((nodes) => nodes.map((node) => {
      const card = node as HTMLElement;
      const visual = card.querySelector<HTMLElement>('.product-picture')!;
      const screen = visual.querySelector<HTMLImageElement>('.product-screen img')!;
      const body = card.querySelector<HTMLElement>('.product-card-body')!;
      const r = card.getBoundingClientRect(), v = visual.getBoundingClientRect(), b = body.getBoundingClientRect();
      return {
        title: card.querySelector('h3')?.textContent,
        direction: getComputedStyle(card).flexDirection,
        height: r.height,
        pictureWidth: v.width,
        pictureLeft: v.left,
        textLeft: b.left,
        textWithin: b.right <= r.right + 1,
        screenSrc: screen.getAttribute('src'),
        categoryVisible: Boolean(card.querySelector('.product-category')?.textContent?.trim())
      };
    }));
    expect(metrics.map((x) => x.title)).toEqual(['Quivra','Melivra','Papira']);
    for (const card of metrics) {
      expect(card.direction, width + ':' + card.title).toBe('row');
      expect(card.pictureLeft + card.pictureWidth, card.title).toBeLessThanOrEqual(card.textLeft + 1);
      expect(card.textWithin, card.title).toBe(true);
      expect(card.height, card.title).toBeLessThan(350);
      expect(card.height, card.title).toBeGreaterThanOrEqual(220);
      expect(card.screenSrc, card.title).toContain('/home-assets/screenshots/android-20261012/ko/');
      expect(card.categoryVisible).toBe(true);
    }
    const height = await section.evaluate((node) => node.getBoundingClientRect().height);
    expect(height, 'mobile section height at ' + width).toBeLessThan(width === 320 ? 1200 : 1130);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  await expect(page.locator('.collection-section .product-card')).toHaveCount(3);
  const desktop = await page.locator('.collection-section .product-card').first().evaluate((el) => getComputedStyle(el).flexDirection);
  expect(desktop).toBe('column');
});

test('mobile trust is a compact three-row section with aligned ordinals in all nine languages', async ({ page }) => {
  const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const rows = page.locator('.trust-grid .trust-item');
    await expect(rows).toHaveCount(3);
    await expect(rows.locator('.trust-ordinal')).toHaveText(['01', '02', '03']);
    const measurements = await rows.evaluateAll((nodes) =>
      nodes.map((el) => {
        const number = el.querySelector('.trust-ordinal')!;
        const heading = el.querySelector('h3')!;
        const body = el.querySelector('p')!;
        const n = number.getBoundingClientRect(), h = heading.getBoundingClientRect();
        const b = body.getBoundingClientRect(), r = el.getBoundingClientRect();
        return {
          rowHeight: r.height,
          columns: getComputedStyle(el).gridTemplateColumns,
          numberToHeading: n.top - h.top,
          headingBesideNumber: n.right < h.left,
          descriptionAligned: Math.abs(b.left - h.left) < 1
        };
      })
    );
    for (const item of measurements) {
      expect(item.headingBesideNumber).toBe(true);
      expect(Math.abs(item.numberToHeading)).toBeLessThanOrEqual(2);
      expect(item.descriptionAligned).toBe(true);
      expect(item.rowHeight).toBeLessThan(185);
    }
    const sectionHeight = await page.locator('.trust-section').evaluate((el) => el.getBoundingClientRect().height);
    expect(sectionHeight, 'Trust mobile ' + locale).toBeLessThan(650);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.goto('/ko/');
  const koHeight = await page.locator('.trust-section').evaluate((el) => el.getBoundingClientRect().height);
  expect(koHeight).toBeLessThan(585);
});

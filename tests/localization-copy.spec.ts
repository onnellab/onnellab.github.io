import { expect, test } from '@playwright/test';

const privacyDateLabels = [
  ['/privacy/', 'Last updated'],
  ['/privacy/ko/', '최종 업데이트'],
  ['/privacy/ja/', '最終更新日'],
  ['/privacy/zh-hans/', '最后更新'],
  ['/privacy/zh-hant/', '最後更新'],
  ['/privacy/pt-br/', 'Última atualização'],
  ['/privacy/de/', 'Zuletzt aktualisiert'],
  ['/privacy/fr/', 'Dernière mise à jour'],
  ['/privacy/es/', 'Última actualización']
] as const;

for (const [route, label] of privacyDateLabels) {
  test(`privacy hub uses the localized update label at ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('.policy-row').first()).toContainText(label);
  });
}

test('confirmed language-quality corrections remain visible', async ({ page }) => {
  await page.goto('/privacy/papira/de/');
  await expect(page.locator('main')).toContainText('Von der App verwaltete Projekte');
  await expect(page.locator('main')).toContainText('Papira respektiert Ihre Privatsphäre.');

  await page.goto('/blog/de/large-text-file-slow-to-open/');
  await expect(page.locator('h1')).toHaveText('Warum das Öffnen großer Textdateien lange dauert');

  await page.goto('/blog/ja/txt-vs-epub-for-long-reading/');
  await expect(page.locator('main')).toContainText('一つを正本と定め、そこから再生成します。');

  await page.goto('/release-notes/tagweaver/2.2/ko/');
  await expect(page.locator('main')).toContainText('일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.');
});

test('audited product wording keeps clear subjects and natural terminology', async ({ page }) => {
  const cases = [
    { path: '/apps/clipnest/', has: 'No account is needed. There are no ads or subscriptions.', absent: 'No account, ads or subscription is required.' },
    { path: '/apps/clipnest/ja/', has: 'ほかのアプリやメモ', absent: '以前のアプリ' },
    { path: '/apps/clipnest/zh-hans/', has: '其他应用', absent: '旧应用' },
    { path: '/apps/clipnest/zh-hant/', has: '其他應用程式', absent: '舊應用程式' },
    { path: '/apps/aligna/fr/', has: 'noms de fichiers audio', absent: 'noms musicaux' },
    { path: '/apps/aligna/es/', has: 'nombres de archivos de música', absent: 'nombres musicales' },
    { path: '/apps/vaultxt/de/', has: 'bei großen Dateien kann die Prüfung entfallen', absent: 'große Dateien können die Prüfung überspringen' },
    { path: '/apps/vaultxt/pt-br/', has: 'a verificação pode ser dispensada', absent: 'arquivos grandes podem pular' },
    { path: '/apps/vaultxt/es/', has: 'la validación puede omitirse', absent: 'los archivos grandes pueden omitir' },
    { path: '/apps/segra/zh-hans/', has: 'Segra 让常用音频编辑更简单。', absent: '保持简单' },
    { path: '/apps/segra/zh-hant/', has: 'Segra 讓常用音訊編輯更簡單。', absent: '保持簡單' }
  ];
  for (const expected of cases) {
    await page.goto(expected.path);
    await expect(page.locator('.copy-column')).toContainText(expected.has);
    await expect(page.locator('.copy-column')).not.toContainText(expected.absent);
  }
  await page.goto('/apps/meriq/ko/');
  const features = await page.locator('.copy-column li').allTextContents();
  expect(features).toHaveLength(8);
  expect(features.every(value => value.trim().endsWith('요'))).toBe(true);
  await page.goto('/apps/meriq/pt-br/');
  await expect(page.locator('.copy-column')).toContainText('Confira a remoção de fundo');
  await expect(page.locator('.copy-column')).toContainText('Prepare e edite as camadas');
  await page.goto('/apps/meriq/ja/');
  await expect(page.locator('.copy-column')).toContainText('後加工レイヤーの準備・編集にはMeriq Proが必要です。');
});

test('French and Spanish FAQs explain file preservation and local processing', async ({ page }) => {
  const cases = [
    ['/apps/quivra/fr/', 'Le fichier original est-il modifié ?', 'le résultat est enregistré dans un nouveau fichier'],
    ['/apps/quivra/es/', '¿Se modifica el original?', 'el resultado se guarda en un archivo nuevo'],
    ['/apps/segra/fr/', 'Les fichiers sont-ils envoyés à un serveur ?', 'traités sur votre appareil'],
    ['/apps/segra/es/', '¿Se envían los archivos a un servidor?', 'se procesan en tu dispositivo']
  ];
  for (const [route, question, explanation] of cases) {
    await page.goto(route);
    const item = page.locator('.faq-band details').filter({ has: page.locator('summary', { hasText: question }) });
    await expect(item).toHaveCount(1);
    await item.locator('summary').click();
    await expect(item.locator('p')).toBeVisible();
    await expect(item.locator('p')).toContainText(explanation);
    await expect(page.locator('.faq-band details')).toHaveCount(4);
  }
});

test('Papira English describes original fiction consistently', async ({ page }) => {
  await page.goto('/apps/papira/');
  const copy = page.locator('.copy-column');
  await expect(copy.locator('p').first()).toContainText('original novels');
  await expect(copy.locator('li').filter({ hasText: 'original novels' })).toHaveCount(1);
  await expect(copy).not.toContainText('personal novels');
  await expect(copy).toContainText('other TXT content can also be converted to EPUB');
});

test('Papira German title explains the TXT-to-EPUB conversion naturally', async ({ page }) => {
  await page.goto('/apps/papira/de/');
  const title = 'Papira - TXT offline in EPUB umwandeln';
  await expect(page).toHaveTitle(title);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
  await expect(page.locator('.hero .intro')).toHaveText('TXT offline in EPUB umwandeln');
  await expect(page.locator('[data-release-status]')).toHaveText('In Vorbereitung');
});

test('TagWeaver French introduction uses complete natural prose', async ({ page }) => {
  await page.goto('/apps/tagweaver/fr/');
  const copy = page.locator('.copy-column');
  await expect(copy.locator('p').first()).toHaveText('TagWeaver permet de consulter et de modifier hors ligne les métadonnées, les notes, les pochettes et les paroles des fichiers MP3 et FLAC.');
  await expect(copy.locator('p').nth(1)).toContainText('les numéros de piste et de disque');
  await expect(copy.locator('p').nth(1)).toContainText('Vous pouvez aussi y gérer les pochettes et les paroles.');
  await expect(copy).toContainText('L’enregistrement de plusieurs fichiers à la fois est disponible avec Pro.');
});

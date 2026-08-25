import {
  allAppPrivacyRouteFor,
  allLocaleDefinitions,
  allProductRouteFor,
  allRouteFor,
  allSiteLocales
} from '../lib/extended-site-i18n';
import {
  getProductPageData,
  getProductSources,
  landingSubtitle,
  pageBodyDescription,
  renderBlocks
} from '../lib/products';
import { getPapiraProductPageData } from '../lib/papira';

const siteUrl = 'https://onnellab.github.io';

const absolute = (path: string) => new URL(path, siteUrl).toString();

function summaryLines(text: string): string[] {
  const blocks = renderBlocks(text);
  const firstParagraph = blocks.find((block) => block.type === 'p')?.value as string | undefined;
  const tasks = blocks.find((block) => block.type === 'ul')?.value as string[] | undefined;
  return [
    ...(firstParagraph ? [`- Summary: ${firstParagraph}`] : []),
    ...(tasks ?? []).slice(0, 4).map((task) => `- Task: ${task}`)
  ];
}

export function GET() {
  const productSources = getProductSources();
  const lines = [
    '# ONNELLAB',
    '',
    'ONNELLAB is an independent software studio creating calm, focused apps for files, text, audio, media, and creative work.',
    '',
    '## Website languages',
    '',
    'ONNELLAB publishes its core site and product pages in nine languages: English, Korean, Japanese, Simplified Chinese, Traditional Chinese, Brazilian Portuguese, German, French, and Spanish.',
    '',
    ...allSiteLocales.flatMap((locale) => {
      const label = allLocaleDefinitions[locale].label;
      return [
        `### ${label}`,
        `- Home: ${absolute(allRouteFor('home', locale))}`,
        `- Apps: ${absolute(allRouteFor('apps', locale))}`,
        `- About: ${absolute(allRouteFor('about', locale))}`,
        `- Privacy hub: ${absolute(allRouteFor('privacy', locale))}`,
        `- Terms: ${absolute(allRouteFor('terms', locale))}`,
        `- Blog: ${absolute(locale === 'en' ? '/blog/' : `/blog/${allLocaleDefinitions[locale].pathSegment}/`)}`,
        ''
      ];
    }),
    '## Apps with nine-language product pages',
    '',
    ...productSources.flatMap((source) => [
      `### ${source.meta.title}`,
      '',
      ...allSiteLocales.flatMap((locale) => {
        const app = getProductPageData(source.slug, locale);
        return [
          `#### ${allLocaleDefinitions[locale].label}`,
          `- Main task: ${landingSubtitle(app.copy)}`,
          ...summaryLines(pageBodyDescription(app.copy)),
          `- Product page: ${absolute(allProductRouteFor(source.slug, locale))}`,
          `- Privacy policy: ${absolute(allAppPrivacyRouteFor(source.slug, locale))}`,
          `- Platforms: ${app.meta.platforms.join(', ')}`,
          ''
        ];
      })
    ]),
    '## Papira',
    '',
    ...allSiteLocales.flatMap((locale) => {
      const app = getPapiraProductPageData(locale);
      return [
        `### Papira (${allLocaleDefinitions[locale].label})`,
        `- Main task: ${landingSubtitle(app.copy)}`,
        ...summaryLines(pageBodyDescription(app.copy)),
        `- Product page: ${absolute(allRouteFor('papira', locale))}`,
        `- Privacy policy: ${absolute(allRouteFor('papiraPrivacy', locale))}`,
        `- Platforms: ${app.meta.platforms.join(', ')}`,
        ''
      ];
    }),
    '## Discovery',
    '',
    `- RSS: ${siteUrl}/rss.xml`,
    `- Sitemap: ${siteUrl}/sitemap.xml`,
    '',
    '## Contact',
    '',
    '- Support: onnellab.app@gmail.com'
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

import {
  allLocaleDefinitions,
  allProductRouteFor,
  allRouteFor,
  allSiteLocales
} from '../lib/extended-site-i18n';
import { getProductPageData, getProductSources } from '../lib/products';
import { getPapiraProductPageData } from '../lib/papira';

// llms.txt v2 stays concise and link-oriented; detailed product facts live on destination pages.
const siteUrl = 'https://onnellab.github.io';

const absolute = (path: string) => new URL(path, siteUrl).toString();
const blogIndexPath = (locale: (typeof allSiteLocales)[number]) =>
  locale === 'en' ? '/blog/' : `/blog/${allLocaleDefinitions[locale].pathSegment}/`;

export function GET() {
  const productSources = getProductSources();
  const lines = [
    '# ONNELLAB',
    '',
    '> ONNELLAB is an independent software studio creating calm, focused apps for files, text, audio, media, and creative work.',
    '',
    'Product pages and core site navigation are available in nine languages: English, Korean, Japanese, Simplified Chinese, Traditional Chinese, Brazilian Portuguese, German, French, and Spanish. Follow the localized indexes below when a language-specific page is needed.',
    '',
    'Support: onnellab.app@gmail.com',
    '',
    '## Apps with nine-language product pages',
    '',
    ...productSources.map((source) => {
      const app = getProductPageData(source.slug, 'en');
      return `- [${source.meta.title}](${absolute(allProductRouteFor(source.slug, 'en'))}): ${app.seoDescription}`;
    }),
    `- [TagWeaver — Japanese](${absolute(allProductRouteFor('tagweaver', 'ja'))}): Representative Japanese localized product page.`,
    `- [TagWeaver — Traditional Chinese](${absolute(allProductRouteFor('tagweaver', 'zh-Hant'))}): Representative Traditional Chinese localized product page.`,
    '',
    '## Papira',
    '',
    `- [Papira](${absolute(allRouteFor('papira', 'en'))}): ${getPapiraProductPageData('en').seoDescription}`,
    `- [Papira — Spanish](${absolute(allRouteFor('papira', 'es'))}): Spanish localized product page.`,
    `- [Papira — Traditional Chinese](${absolute(allRouteFor('papira', 'zh-Hant'))}): Traditional Chinese localized product page.`,
    '',
    '## Localized app indexes',
    '',
    ...allSiteLocales.map((locale) =>
      `- [Apps — ${allLocaleDefinitions[locale].label}](${absolute(allRouteFor('apps', locale))}): Product index in ${allLocaleDefinitions[locale].label}.`
    ),
    '',
    '## Blog Articles',
    '',
    ...allSiteLocales.map((locale) =>
      `- [Guides — ${allLocaleDefinitions[locale].label}](${absolute(blogIndexPath(locale))}): ONNELLAB guides and answer-focused articles in ${allLocaleDefinitions[locale].label}.`
    ),
    '',
    '## Optional',
    '',
    `- [Home](${absolute(allRouteFor('home', 'en'))}): ONNELLAB studio home.`,
    `- [About](${absolute(allRouteFor('about', 'en'))}): Studio background and product principles.`,
    `- [Privacy](${absolute(allRouteFor('privacy', 'en'))}): Privacy hub for ONNELLAB apps.`,
    `- [Terms](${absolute(allRouteFor('terms', 'en'))}): Site terms.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): Complete indexable URL inventory with language alternates.`,
    `- [RSS](${siteUrl}/rss.xml): Latest ONNELLAB guide feed.`
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

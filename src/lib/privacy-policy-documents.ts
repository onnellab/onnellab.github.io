import fs from 'node:fs';
import path from 'node:path';

import { getAppPrivacyCopy, type PrivacyAppSlug, type TranslatedPrivacyLocale } from './app-privacy-localizations';
import { papiraPrivacyCopies } from './papira-privacy-copy';
import { getLunaryPrivacyCopy } from './lunary-privacy';
import type { AllSiteLocale } from './extended-site-i18n';

// Routes, styling and chrome are shared; app-specific privacy statements remain independent.
export const allPrivacyAppSlugs = [
  'aligna', 'clipnest', 'lunary', 'melivra', 'meriq',
  'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'
] as const;
export type AllPrivacyAppSlug = (typeof allPrivacyAppSlugs)[number];

export type PolicyBlock =
  | { kind: 'paragraph'; value: string }
  | { kind: 'list'; items: string[] };
export type PolicySection = { title: string; blocks: PolicyBlock[] };
export type PolicyDocument = {
  appName: string;
  title: string;
  description: string;
  intro: string;
  updatedLabel: string;
  updatedAt: string;
  heading: string;
  opening: string;
  sections: PolicySection[];
  externalLinks?: Array<{ label: string; href: string }>;
};

const staticSource = path.resolve(process.cwd(), 'src/content/privacy-policies');
const googlePolicyUrl = 'https://developers.google.com/terms/api-services-user-data-policy';

export function getPrivacyPolicyDocument(slug: AllPrivacyAppSlug, locale: AllSiteLocale): PolicyDocument {
  if (slug === 'papira') {
    const source = papiraPrivacyCopies[locale];
    return {
      appName: 'Papira', title: source.title, description: source.description,
      intro: source.intro, updatedLabel: source.updatedLabel,
      updatedAt: source.updatedValue, heading: source.heading, opening: source.opening,
      sections: source.sections.map((section) => ({
        title: section.title,
        blocks: [
          ...(section.paragraphs ?? []).map((value): PolicyBlock => ({ kind: 'paragraph', value })),
          ...(section.items?.length ? [{ kind: 'list', items: section.items } as PolicyBlock] : [])
        ]
      }))
    };
  }

  if (slug === 'lunary') {
    const source = getLunaryPrivacyCopy(locale);
    return {
      appName: 'Lunary', title: source.title, description: source.description,
      intro: source.intro, updatedLabel: source.updatedLabel,
      updatedAt: source.updatedValue, heading: source.heading, opening: source.opening,
      sections: source.sections.map((section) => ({
        title: section.title,
        blocks: [
          ...(section.items?.length ? [{ kind: 'list', items: section.items } as PolicyBlock] : []),
          ...(section.paragraphs ?? []).map((value): PolicyBlock => ({ kind: 'paragraph', value }))
        ]
      })),
      externalLinks: [{ label: 'Google API Services User Data Policy', href: googlePolicyUrl }]
    };
  }

  if (locale === 'en' || locale === 'ko') {
    const sourcePath = path.join(staticSource, locale, slug + '.json');
    const document = JSON.parse(fs.readFileSync(sourcePath, 'utf8')) as PolicyDocument;
    if (document.sections.length !== 8 || document.appName.trim().length === 0) {
      throw new Error('Invalid preserved privacy source: ' + sourcePath);
    }
    return document;
  }

  const { localeText, details } = getAppPrivacyCopy(
    slug as PrivacyAppSlug, locale as TranslatedPrivacyLocale
  );
  const sections: PolicySection[] = [
    { title: localeText.headings[0], blocks: [{ kind: 'paragraph', value: details.accounts }] },
    { title: localeText.headings[1], blocks: [
      { kind: 'list', items: details.deviceItems },
      { kind: 'list', items: details.deviceNotes }
    ] },
    { title: localeText.headings[2], blocks: [
      ...(details.serverItems?.length
        ? [{ kind: 'list', items: details.serverItems } as PolicyBlock]
        : []),
      { kind: 'paragraph', value: details.serverBody }
    ] },
    { title: localeText.headings[3], blocks: [{ kind: 'paragraph', value: details.payment }] },
    { title: localeText.headings[4], blocks: [{ kind: 'paragraph', value: details.sharing }] },
    { title: localeText.headings[5], blocks: [{ kind: 'paragraph', value: details.retention }] },
    { title: localeText.headings[6], blocks: [{ kind: 'paragraph', value: details.security }] },
    { title: localeText.headings[7], blocks: [
      { kind: 'paragraph', value: localeText.change },
      { kind: 'paragraph', value: localeText.contact + ' onnellab.app@gmail.com' }
    ] }
  ];
  return {
    appName: details.appName,
    title: details.appName + ' ' + localeText.policyTitle,
    description: localeText.applies(details.appName),
    intro: localeText.applies(details.appName),
    updatedLabel: localeText.updated, updatedAt: details.updatedAt,
    heading: localeText.policyTitle, opening: localeText.intro(details.appName),
    sections
  };
}

import fs from 'node:fs';
import path from 'node:path';
import { allLocaleDefinitions, type AllSiteLocale } from './extended-site-i18n';
import type { PolicyDocument } from './privacy-policy-documents';

export type SonaryLegalKind = 'privacy' | 'terms';
export function sonaryTermsRouteFor(locale: AllSiteLocale): string {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return '/terms/sonary/' + (segment ? segment + '/' : '');
}
export function getSonaryLegalDocument(kind: SonaryLegalKind, locale: AllSiteLocale): PolicyDocument {
  const source = path.resolve(process.cwd(), 'src/content/sonary-legal', kind, locale + '.json');
  const document = JSON.parse(fs.readFileSync(source, 'utf8')) as PolicyDocument;
  if (document.appName !== 'Sonary' || document.sections.length !== 8 || document.updatedAt !== '2026-10-12') {
    throw new Error('Invalid Sonary legal document');
  }
  return document;
}

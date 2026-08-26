import {
  replaceAcross,
  replaceExact
} from './utils.mjs';

replaceExact(
  'src/lib/app-privacy-localizations.ts',
  '商店提供的產品、交易與權益資訊可能用於驗證與回復購買。',
  '商店提供的產品、交易與權益資訊可能用於驗證並恢復購買。'
);

replaceExact(
  'src/components/PapiraPrivacyPage.astro',
  "heading: 'Datenschutzerklärung', opening: 'Papira schützt Ihre Privatsphäre.'",
  "heading: 'Datenschutzerklärung', opening: 'Papira respektiert Ihre Privatsphäre.'"
);
replaceExact(
  'src/components/PapiraPrivacyPage.astro',
  'Vom App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches',
  'Von der App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches'
);
replaceExact(
  'src/components/PapiraPrivacyPage.astro',
  'Wenn sich Papira-Funktionen oder gesetzliche beziehungsweise Anforderungen der Stores ändern',
  'Wenn sich Papira-Funktionen, gesetzliche Anforderungen oder Anforderungen der App-Stores ändern'
);

replaceExact(
  'src/content/blog/de/large-text-file-slow-to-open.md',
  'title: "Warum große Textdateien langsam öffnen"',
  'title: "Warum das Öffnen großer Textdateien lange dauert"'
);
replaceExact(
  'src/content/blog/de/large-text-file-slow-to-open.md',
  'card_title: "Warum große Textdateien langsam öffnen"',
  'card_title: "Warum das Öffnen großer Textdateien lange dauert"'
);
replaceExact(
  'src/content/blog/de/large-text-file-slow-to-open.md',
  'description: "Warum große Textdateien langsam öffnen können und wie',
  'description: "Warum das Öffnen großer Textdateien lange dauern kann und wie'
);
replaceExact(
  'src/content/blog/de/large-text-file-slow-to-open.md',
  '# Warum große Textdateien langsam öffnen',
  '# Warum das Öffnen großer Textdateien lange dauert'
);

replaceExact(
  'src/content/blog/ja/txt-vs-epub-for-long-reading.md',
  '一つをSoTにして再生成します。',
  '一つを正本（Source of Truth）と定め、そこから再生成します。'
);

replaceExact(
  'src/components/ExtendedSitePage.astro',
  "{ title: 'Calmo por padrão', body:",
  "{ title: 'Calma por padrão', body:"
);
replaceExact(
  'src/components/ExtendedSitePage.astro',
  "{ title: 'Enfocado', body:",
  "{ title: 'Enfoque', body:"
);
replaceExact(
  'src/components/ExtendedSitePage.astro',
  "{ title: 'Tranquilo', body:",
  "{ title: 'Calma', body:"
);
replaceExact(
  'src/components/ExtendedSitePage.astro',
  "{ title: 'Respetuoso', body:",
  "{ title: 'Respeto', body:"
);

replaceAcross('src/content/blog/pt-BR', 'arte do álbum', 'capa do álbum', { extensions: ['.md'] });
replaceExact(
  'src/content/blog/zh-Hans/clean-up-mp3-metadata-before-organizing-music.md',
  'feat. 表记',
  'feat. 的标注方式'
);
replaceExact(
  'src/content/blog/zh-Hant/clean-up-mp3-metadata-before-organizing-music.md',
  'feat. 表記',
  'feat. 的標記方式'
);
replaceExact(
  'src/content/blog/ko/txt-vs-epub-for-long-reading.md',
  'image_specs: "Workflow diagram for 긴 글 TXT EPUB 비교|Comparison diagram for practical options|Screenshot requirements for related applications"',
  'image_specs: "긴 글 TXT·EPUB 비교 작업 흐름도|실용적인 선택지 비교 도표|관련 앱 화면 이미지 요구사항"'
);

replaceAcross('src', 'Aucune connexion', 'Aucun compte requis');
replaceExact(
  'src/lib/app-privacy-localizations.ts',
  'Anonymer, vom Server ausgegebener Subjektbezeichner',
  'Anonyme, vom Server vergebene Benutzerkennung'
);

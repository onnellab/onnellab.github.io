from pathlib import Path


def patch(path: str, replacements: list[tuple[str, str]]) -> None:
    p = Path(path)
    text = p.read_text()
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text == original:
        print(f'no change: {path}')
    else:
        p.write_text(text)
        print(f'updated: {path}')


patch('src/content/blog/fr/reuse-copied-text-snippets-iphone.md', [
    ('Supprimez espaces accidentelles, salutations obsolètes, paramètres de suivi et détails privés inutiles au modèle.',
     'Supprimez les espaces accidentels, les salutations obsolètes, les paramètres de suivi et les détails privés inutiles au modèle.'),
    ('Remplacez noms, dates, montants et espaces réservées ; ne considérez jamais le fragment comme un texte final automatique.',
     'Remplacez les noms, les dates, les montants et les marqueurs ; ne considérez jamais le fragment comme un texte final automatique.'),
    ('liens expirés, mauvais noms, espaces réservées non remplacées et erreurs de mise en forme',
     'liens expirés, mauvais noms, marqueurs non remplacés et erreurs de mise en forme'),
])

patch('src/content/blog/es/verify-audio-clips-before-combining.md', [
    ('formato de sample', 'formato de muestra'),
    ('la mayor excursión del señal', 'la mayor excursión de la señal'),
    ('1. Inventaría los archivos y fija el orden.', '1. Haz un inventario de los archivos y fija el orden.'),
])

patch('src/components/ExtendedBlogIndex.astro', [
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '実用ワークフローガイド'",
     "apps: 'アプリ', eyebrow: 'ONNELLAB Blog', heading: '実用ワークフローガイド'"),
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '实用工作流指南'",
     "apps: '应用', eyebrow: 'ONNELLAB Blog', heading: '实用工作流指南'"),
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '實用工作流程指南'",
     "apps: '應用程式', eyebrow: 'ONNELLAB Blog', heading: '實用工作流程指南'"),
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guias práticos de fluxo de trabalho'",
     "apps: 'Aplicativos', eyebrow: 'ONNELLAB Blog', heading: 'Guias práticos de fluxo de trabalho'"),
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guides pratiques de workflow'",
     "apps: 'Applications', eyebrow: 'ONNELLAB Blog', heading: 'Guides pratiques de workflow'"),
    ("apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guías prácticas de flujo de trabajo'",
     "apps: 'Aplicaciones', eyebrow: 'ONNELLAB Blog', heading: 'Guías prácticas de flujo de trabajo'"),
    ("const copy = copies[locale];",
     "const copy = copies[locale];\nconst privacyLabel: Record<TranslatedPrivacyLocale, string> = {\n  ja: 'プライバシー',\n  'zh-Hans': '隐私',\n  'zh-Hant': '隱私權',\n  'pt-BR': 'Privacidade',\n  de: 'Datenschutz',\n  fr: 'Confidentialité',\n  es: 'Privacidad'\n};"),
    ("<a href={allRouteFor('privacy', locale)}>Privacy</a>",
     "<a href={allRouteFor('privacy', locale)}>{privacyLabel[locale]}</a>"),
])

patch('src/components/ExtendedBlogArticle.astro', [
    ("ja: { apps: 'Apps', blog: 'ブログ'", "ja: { apps: 'アプリ', blog: 'ブログ'"),
    ("'zh-Hans': { apps: 'Apps', blog: '博客'", "'zh-Hans': { apps: '应用', blog: '博客'"),
    ("'zh-Hant': { apps: 'Apps', blog: '部落格'", "'zh-Hant': { apps: '應用程式', blog: '部落格'"),
    ("'pt-BR': { apps: 'Apps', blog: 'Blog'", "'pt-BR': { apps: 'Aplicativos', blog: 'Blog'"),
    ("fr: { apps: 'Apps', blog: 'Blog'", "fr: { apps: 'Applications', blog: 'Blog'"),
    ("es: { apps: 'Apps', blog: 'Blog'", "es: { apps: 'Aplicaciones', blog: 'Blog'"),
])

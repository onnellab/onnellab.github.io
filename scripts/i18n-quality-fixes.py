from pathlib import Path


def replace(path: str, old: str, new: str, expected: int = 1) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{path}: expected {expected}, found {count}: {old!r}")
    p.write_text(text.replace(old, new))


# French prose: remove literal/grammatically incorrect placeholder wording.
replace(
    'src/content/blog/fr/reuse-copied-text-snippets-iphone.md',
    'Supprimez espaces accidentelles, salutations obsolètes, paramètres de suivi et détails privés inutiles au modèle.',
    'Supprimez les espaces accidentels, les salutations obsolètes, les paramètres de suivi et les détails privés inutiles au modèle.'
)
replace(
    'src/content/blog/fr/reuse-copied-text-snippets-iphone.md',
    'Remplacez noms, dates, montants et espaces réservées ; ne considérez jamais le fragment comme un texte final automatique.',
    'Remplacez les noms, les dates, les montants et les marqueurs ; ne considérez jamais le fragment comme un texte final automatique.'
)
replace(
    'src/content/blog/fr/reuse-copied-text-snippets-iphone.md',
    'liens expirés, mauvais noms, espaces réservées non remplacées et erreurs de mise en forme',
    'liens expirés, mauvais noms, marqueurs non remplacés et erreurs de mise en forme'
)

# Spanish prose: prefer native technical wording and fix grammar.
path = Path('src/content/blog/es/verify-audio-clips-before-combining.md')
text = path.read_text()
count = text.count('formato de sample')
if count != 2:
    raise SystemExit(f'es audio verification: expected 2 formato de sample, found {count}')
text = text.replace('formato de sample', 'formato de muestra')
if text.count('la mayor excursión del señal') != 1:
    raise SystemExit('es audio verification: signal grammar marker missing')
text = text.replace('la mayor excursión del señal', 'la mayor excursión de la señal')
if text.count('1. Inventaría los archivos y fija el orden.') != 1:
    raise SystemExit('es audio verification: inventory imperative marker missing')
text = text.replace('1. Inventaría los archivos y fija el orden.', '1. Haz un inventario de los archivos y fija el orden.')
path.write_text(text)

# Extended blog index: localize navigation/footer labels that were still English.
path = Path('src/components/ExtendedBlogIndex.astro')
text = path.read_text()
replacements = {
    "ja: { title: 'ONNELLABブログ", "ja: { title: 'ONNELLABブログ",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '実用ワークフローガイド'": "apps: 'アプリ', eyebrow: 'ONNELLAB Blog', heading: '実用ワークフローガイド'",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '实用工作流指南'": "apps: '应用', eyebrow: 'ONNELLAB Blog', heading: '实用工作流指南'",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: '實用工作流程指南'": "apps: '應用程式', eyebrow: 'ONNELLAB Blog', heading: '實用工作流程指南'",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guias práticos de fluxo de trabalho'": "apps: 'Aplicativos', eyebrow: 'ONNELLAB Blog', heading: 'Guias práticos de fluxo de trabalho'",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guides pratiques de workflow'": "apps: 'Applications', eyebrow: 'ONNELLAB Blog', heading: 'Guides pratiques de workflow'",
    "apps: 'Apps', eyebrow: 'ONNELLAB Blog', heading: 'Guías prácticas de flujo de trabajo'": "apps: 'Aplicaciones', eyebrow: 'ONNELLAB Blog', heading: 'Guías prácticas de flujo de trabajo'",
}
for old, new in replacements.items():
    if old == new:
        continue
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'ExtendedBlogIndex expected 1, found {count}: {old!r}')
    text = text.replace(old, new)
# Add locale-aware privacy label to each copy block using its unique allCategories tail.
privacy_inserts = {
    "allCategories: 'すべて'": "allCategories: 'すべて', privacy: 'プライバシー'",
    "allCategories: '全部'": "allCategories: '全部', privacy: '隐私'",
    "allCategories: '全部'": "allCategories: '全部', privacy: '隱私權'",
}
# The Chinese blocks share the same allCategories token, so patch by nearby language-specific post label instead.
if text.count("posts: '公開済みの記事', allCategories: 'すべて'") != 1:
    raise SystemExit('Japanese privacy insertion marker missing')
text = text.replace("posts: '公開済みの記事', allCategories: 'すべて'", "posts: '公開済みの記事', allCategories: 'すべて', privacy: 'プライバシー'")
if text.count("posts: '已发布文章', allCategories: '全部'") != 1:
    raise SystemExit('Simplified Chinese privacy insertion marker missing')
text = text.replace("posts: '已发布文章', allCategories: '全部'", "posts: '已发布文章', allCategories: '全部', privacy: '隐私'")
if text.count("posts: '已發布文章', allCategories: '全部'") != 1:
    raise SystemExit('Traditional Chinese privacy insertion marker missing')
text = text.replace("posts: '已發布文章', allCategories: '全部'", "posts: '已發布文章', allCategories: '全部', privacy: '隱私權'")
for old, new in [
    ("posts: 'Artigos publicados', allCategories: 'Todos'", "posts: 'Artigos publicados', allCategories: 'Todos', privacy: 'Privacidade'"),
    ("posts: 'Veröffentlichte Artikel', allCategories: 'Alle'", "posts: 'Veröffentlichte Artikel', allCategories: 'Alle', privacy: 'Datenschutz'"),
    ("posts: 'Articles publiés', allCategories: 'Toutes'", "posts: 'Articles publiés', allCategories: 'Toutes', privacy: 'Confidentialité'"),
    ("posts: 'Artículos publicados', allCategories: 'Todas'", "posts: 'Artículos publicados', allCategories: 'Todas', privacy: 'Privacidad'"),
]:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'ExtendedBlogIndex privacy marker missing: {old!r}, count={count}')
    text = text.replace(old, new)
if text.count("<a href={allRouteFor('privacy', locale)}>Privacy</a>") != 1:
    raise SystemExit('ExtendedBlogIndex footer privacy marker missing')
text = text.replace("<a href={allRouteFor('privacy', locale)}>Privacy</a>", "<a href={allRouteFor('privacy', locale)}>{copy.privacy}</a>")
path.write_text(text)

# Extended article nav should not show English "Apps" in languages where that feels foreign.
path = Path('src/components/ExtendedBlogArticle.astro')
text = path.read_text()
for old, new in [
    ("ja: { apps: 'Apps', blog: 'ブログ'", "ja: { apps: 'アプリ', blog: 'ブログ'"),
    ("'zh-Hans': { apps: 'Apps', blog: '博客'", "'zh-Hans': { apps: '应用', blog: '博客'"),
    ("'zh-Hant': { apps: 'Apps', blog: '部落格'", "'zh-Hant': { apps: '應用程式', blog: '部落格'"),
    ("'pt-BR': { apps: 'Apps', blog: 'Blog'", "'pt-BR': { apps: 'Aplicativos', blog: 'Blog'"),
    ("fr: { apps: 'Apps', blog: 'Blog'", "fr: { apps: 'Applications', blog: 'Blog'"),
    ("es: { apps: 'Apps', blog: 'Blog'", "es: { apps: 'Aplicaciones', blog: 'Blog'"),
]:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'ExtendedBlogArticle marker missing: {old!r}, count={count}')
    text = text.replace(old, new)
path.write_text(text)

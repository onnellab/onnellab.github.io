from pathlib import Path
import re

slugs = ['aligna','clipnest','melivra','meriq','quivra','segra','tagweaver','vaultxt']
locales = [
    ('en', '', 'English'),
    ('ko', 'ko', '한국어'),
    ('ja', 'ja', '日本語'),
    ('zh-Hans', 'zh-hans', '简体中文'),
    ('zh-Hant', 'zh-hant', '繁體中文'),
    ('pt-BR', 'pt-br', 'Português (Brasil)'),
    ('de', 'de', 'Deutsch'),
    ('fr', 'fr', 'Français'),
    ('es', 'es', 'Español'),
]


def route(slug: str, segment: str) -> str:
    base = f'https://onnellab.github.io/privacy/{slug}/'
    return base if not segment else f'{base}{segment}/'


def alternates(slug: str) -> str:
    lines = [f'  <link rel="alternate" hreflang="{code}" href="{route(slug, segment)}">' for code, segment, _ in locales]
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="{route(slug, "")}">')
    return '\n'.join(lines)


def language_menu(slug: str, current: str, home_href: str, nav_label: str) -> str:
    current_label = next(label for code, _, label in locales if code == current)
    links = []
    for code, segment, label in locales:
        current_attr = ' aria-current="page"' if code == current else ''
        links.append(
            f'      <a href="{route(slug, segment)}" lang="{code}" hreflang="{code}" data-locale-choice="{code}"{current_attr}>{label}</a>'
        )
    return (
        f'<nav class="topbar" aria-label="{nav_label}">\n'
        f'  <a class="home-link" href="{home_href}">ONNELLAB</a>\n'
        f'  <details class="language-menu">\n'
        f'    <summary class="language-link">{current_label}</summary>\n'
        f'    <div class="language-menu-panel">\n' + '\n'.join(links) + '\n'
        f'    </div>\n'
        f'  </details>\n'
        f'</nav>'
    )

for slug in slugs:
    for current, relative, _ in [('en', '', 'English'), ('ko', 'ko', '한국어')]:
        file = Path('public/privacy') / slug / relative / 'index.html' if relative else Path('public/privacy') / slug / 'index.html'
        text = file.read_text()

        alt_pattern = re.compile(r'(?:  <link rel="alternate" hreflang="[^"]+" href="[^"]+">\n)+')
        match = alt_pattern.search(text)
        if not match:
            raise SystemExit(f'no hreflang block in {file}')
        text = text[:match.start()] + alternates(slug) + '\n' + text[match.end():]

        nav_pattern = re.compile(r'<nav class="topbar"[^>]*>.*?</nav>', re.S)
        nav_matches = list(nav_pattern.finditer(text))
        if len(nav_matches) != 1:
            raise SystemExit(f'expected one topbar in {file}, found {len(nav_matches)}')
        home = 'https://onnellab.github.io/' if current == 'en' else 'https://onnellab.github.io/ko/'
        nav_label = 'Navigation' if current == 'en' else '탐색'
        text = nav_pattern.sub(language_menu(slug, current, home, nav_label), text, count=1)
        file.write_text(text)

css_path = Path('public/legacy-privacy.css')
css = css_path.read_text()
marker = '.language-menu {'
if marker not in css:
    css += '''\n\n.language-menu {\n  position: relative;\n}\n\n.language-menu > summary {\n  cursor: pointer;\n  list-style: none;\n}\n\n.language-menu > summary::-webkit-details-marker {\n  display: none;\n}\n\n.language-menu > summary::after {\n  content: '⌄';\n  margin-left: 7px;\n  color: #90877b;\n  font-size: 12px;\n}\n\n.language-menu-panel {\n  position: absolute;\n  z-index: 20;\n  top: calc(100% + 8px);\n  right: 0;\n  width: max-content;\n  min-width: 170px;\n  display: grid;\n  gap: 2px;\n  border: 1px solid #ded6ca;\n  border-radius: 12px;\n  padding: 6px;\n  background: #fffdf8;\n  box-shadow: 0 14px 34px rgba(57, 48, 39, 0.11);\n}\n\n.language-menu-panel a {\n  border-radius: 8px;\n  padding: 8px 10px;\n  color: #5f5a50;\n  font-size: 13px;\n  font-weight: 560;\n  text-decoration: none;\n}\n\n.language-menu-panel a:hover,\n.language-menu-panel a[aria-current='page'] {\n  background: #f4efe7;\n  color: #383631;\n}\n\n.language-menu-panel a:focus-visible {\n  outline: 2px solid #827d72;\n  outline-offset: 2px;\n}\n'''
    css_path.write_text(css)

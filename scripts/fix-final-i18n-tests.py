from pathlib import Path

# Core regression test: locale segments already include the trailing slash.
path = Path('tests/site-i18n.spec.ts')
text = path.read_text()
text = text.replace(
    '`https://onnellab.github.io/privacy/${slug}/${segment}/`',
    '`https://onnellab.github.io/privacy/${slug}/${segment}`'
)
path.write_text(text)

# Extended product has the same privacy action in the side card and footer;
# assert the functional side-card link rather than relying on a globally unique label.
path = Path('tests/extended-i18n.spec.ts')
text = path.read_text()
old = """      await expect(\n        page.getByRole('link', { name: /privacy|privacidade|datenschutz|confidentialité|privacidad/i })\n      ).toHaveAttribute('href', `/privacy/tagweaver/${locale.segment}/`);"""
new = """      await expect(\n        page.locator('.side-card').getByRole('link', { name: /privacy|privacidade|datenschutz|confidentialité|privacidad/i })\n      ).toHaveAttribute('href', `/privacy/tagweaver/${locale.segment}/`);"""
if old not in text:
    raise SystemExit('extended privacy locator marker not found')
text = text.replace(old, new)
path.write_text(text)

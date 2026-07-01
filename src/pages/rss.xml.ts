import { getProductIndexItems } from '../lib/products';

export function GET() {
  const items = getProductIndexItems('en');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ONNELLAB Apps</title>
    <link>https://onnelakin.github.io/</link>
    <description>ONNELLAB app index</description>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${new URL(item.href, 'https://onnelakin.github.io').toString()}</link>
      <description>${escapeXml(item.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

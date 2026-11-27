import pins from '../../data/ondo-paper-pins.json';

const site = 'https://onnellab.com';
const base = `${site}/ondo-paper/pins`;

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function GET() {
  const items = pins.map((pin) => `
    <item>
      <title>${escapeXml(pin.title)}</title>
      <description>${escapeXml(pin.description)}</description>
      <link>${base}/${pin.slug}/</link>
      <guid>${base}/${pin.slug}/</guid>
      <pubDate>${new Date(pin.publishedAt).toUTCString()}</pubDate>
      <media:content url="${base}/${pin.slug}.png" type="image/png" medium="image" />
    </item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>ONDO PAPER</title>
    <link>${site}/ondo-paper/</link>
    <description>Digital planners, calendars, and journaling accessories from ONDO PAPER.</description>${items}
  </channel>
</rss>
`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

/**
 * Small, safe inline subset for the custom ONNELLAB blog block renderer.
 * Block parsing stays in blog.ts. HTML is rendered with Astro elements,
 * never by interpolating unchecked Markdown into set:html.
 */
export type BlogInlineToken =
  | { kind: 'text' | 'strong' | 'em' | 'code'; value: string }
  | { kind: 'link'; value: string; href: string };

function allowedLink(href: string): boolean {
  return /^(?:https?:\/\/|mailto:|\/(?!\/)|\.\.?\/|#)/i.test(href);
}

export function parseBlogInline(value: string): BlogInlineToken[] {
  const tokens: BlogInlineToken[] = [];
  let literal = '';
  let index = 0;
  const flush = () => {
    if (literal) tokens.push({ kind: 'text', value: literal });
    literal = '';
  };

  while (index < value.length) {
    const rest = value.slice(index);
    if (rest[0] === '\\' && rest.length > 1 && /[\\\\*\x60\[\]()]/.test(rest[1])) {
      literal += rest[1];
      index += 2;
      continue;
    }

    const code = rest.match(/^\x60([^\x60\n]+)\x60/);
    if (code) {
      flush();
      tokens.push({ kind: 'code', value: code[1] });
      index += code[0].length;
      continue;
    }

    const link = rest.match(/^\[([^\]\n]+)\]\(([^)\s]+)\)/);
    if (link && allowedLink(link[2])) {
      flush();
      tokens.push({ kind: 'link', value: link[1], href: link[2] });
      index += link[0].length;
      continue;
    }

    const strong = rest.match(/^\*\*([^*\n]+)\*\*/);
    if (strong && strong[1].trim()) {
      flush();
      tokens.push({ kind: 'strong', value: strong[1] });
      index += strong[0].length;
      continue;
    }

    const em = rest.match(/^\*([^*\n]+)\*/);
    if (em && em[1].trim()) {
      flush();
      tokens.push({ kind: 'em', value: em[1] });
      index += em[0].length;
      continue;
    }
    literal += rest[0];
    index += 1;
  }
  flush();
  return tokens;
}

/** Plain label text for CSS attributes and narrow table layouts. */
export function plainBlogInline(value: string): string {
  return parseBlogInline(value)
    .map((part) => part.kind === 'text' || part.kind === 'code' ? part.value : plainBlogInline(part.value))
    .join('');
}

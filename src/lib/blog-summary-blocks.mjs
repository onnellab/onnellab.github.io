// Preserve authored content unless a plain paragraph is an exact duplicate.
export function preserveShortAnswerContent(blocks, headings, summary) {
  const result = [];
  for (let index = 0; index < blocks.length;) {
    const heading = blocks[index];
    if (heading.type !== 'h2' || !headings.has(String(heading.value).trim().toLowerCase())) {
      result.push(heading);
      index += 1;
      continue;
    }
    let end = index + 1;
    while (end < blocks.length && blocks[end].type !== 'h2') end += 1;
    const content = blocks.slice(index + 1, end);
    const first = content[0];
    if (first?.type === 'p' && typeof first.value === 'string'
        && first.value === summary && !/[*_`\[\]<>\\\\]/.test(first.value)) {
      content.shift();
    }
    if (content.length) result.push(heading, ...content);
    index = end;
  }
  return result;
}

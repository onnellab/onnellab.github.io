export function GET() {
  return new Response(
    `# ONNELLAB crawler policy
# Search discovery and user-requested retrieval are allowed.
# AI training and bulk dataset crawling are not allowed.

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Disallow: /manual-publish/
Allow: /

User-agent: ChatGPT-User
Disallow: /manual-publish/
Allow: /

User-agent: Claude-SearchBot
Disallow: /manual-publish/
Allow: /

User-agent: Claude-User
Disallow: /manual-publish/
Allow: /

User-agent: PerplexityBot
Disallow: /manual-publish/
Allow: /

User-agent: Perplexity-User
Disallow: /manual-publish/
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Meta-ExternalFetcher
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: *
Allow: /

Sitemap: https://onnellab.github.io/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}

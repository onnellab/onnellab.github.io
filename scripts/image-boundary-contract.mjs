import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import DisabledHttpCache from '../vendor/disabled-http-cache/index.js';
import service, { staticImageBoundary, staticImageServiceEntrypoint } from './static-image-service.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJSON = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const boundaryError = { code: 'ONNELLAB_IMAGE_PROCESSING_DISABLED' };
const cacheError = { code: 'ONNELLAB_HTTP_CACHE_DISABLED' };

// These values are inputs only. The replacement must not inspect, retain, or
// echo them, even for public caches, private cookies, or attacker max-stale.
const responseHeaders = [
  { 'cache-control': 'public, max-age=86400' },
  { 'set-cookie': 'private-session=do-not-log', 'cache-control': 'max-age=86400' },
  { 'cache-control': 'private, max-age=86400' },
  { 'cache-control': 'no-store' },
  { 'cache-control': 'no-cache' },
  { 'cache-control': 'proxy-revalidate, max-age=0' },
  { 'cache-control': 'must-revalidate, max-age=0' },
  { vary: '*' },
];

test('sentinel has no cache implementation or argument-dependent behavior', () => {
  for (const headers of responseHeaders) {
    assert.throws(() => new DisabledHttpCache(
      { url: 'https://example.test/private', headers: { 'cache-control': 'max-stale=999999999' } },
      { status: 200, headers },
    ), (error) => error.code === cacheError.code && !error.message.includes('private-session'));
  }
  const unreadable = new Proxy({}, { get() { throw new Error('Arguments must not be inspected'); } });
  assert.throws(() => new DisabledHttpCache(unreadable, unreadable), cacheError);
  assert.deepEqual(Object.getOwnPropertyNames(DisabledHttpCache.prototype), ['constructor']);
});

test('service rejects all optimization entrypoints and cannot transform or cache bytes', () => {
  assert.equal('transform' in service, false);
  assert.equal('parseURL' in service, false);
  for (const method of ['getRemoteSize', 'validateOptions', 'getURL', 'getHTMLAttributes']) {
    for (const src of ['https://example.test/private.png', '/app-assets/example.png', { src: '/_astro/example.png' }]) {
      assert.throws(() => service[method]({ src, inferSize: true }), boundaryError);
    }
  }
});

test('configuration boundary rejects SSR, adapters, service changes and restored incremental images', () => {
  const check = staticImageBoundary().hooks['astro:config:done'];
  const config = {
    output: 'static',
    image: { service: { entrypoint: staticImageServiceEntrypoint } },
    experimental: { incrementalBuild: false },
  };
  assert.doesNotThrow(() => check({ config, buildOutput: 'static' }));
  assert.throws(() => check({ config, buildOutput: 'server' }), /static/);
  assert.throws(() => check({ config: { ...config, output: 'server' } }), /static/);
  assert.throws(() => check({ config: { ...config, adapter: { name: 'test' } } }), /static/);
  assert.throws(() => check({ config: { ...config, image: { service: { entrypoint: 'astro/assets/services/sharp' } } } }), /boundary/);
  assert.throws(() => check({ config: { ...config, experimental: { incrementalBuild: true } } }), /Incremental/);
});

test('lockfile removes upstream cache code and scopes the independent sentinel to the reviewed consumer', () => {
  const manifest = readJSON('package.json');
  const lock = readJSON('package-lock.json');
  assert.equal(manifest.dependencies.astro, '7.3.3');
  assert.equal(lock.packages['node_modules/astro'].version, '7.3.3');
  assert.equal(manifest.dependencies['http-cache-semantics'], 'file:vendor/disabled-http-cache');
  assert.equal(manifest.overrides['http-cache-semantics'], '$http-cache-semantics');
  assert.deepEqual(lock.packages['node_modules/http-cache-semantics'], {
    resolved: 'vendor/disabled-http-cache', link: true,
  });
  assert.equal(lock.packages['vendor/disabled-http-cache'].name, '@onnellab/disabled-http-cache');
  assert.equal(readJSON('vendor/disabled-http-cache/package.json').private, true);
  const consumers = Object.entries(lock.packages)
    .filter(([name, pkg]) => name !== '' && pkg.dependencies?.['http-cache-semantics'])
    .map(([name]) => name);
  assert.deepEqual(consumers, ['node_modules/astro']);
  for (const [name, pkg] of Object.entries(lock.packages)) {
    assert.ok(!pkg.resolved?.includes('/http-cache-semantics-'), `Upstream cache tarball remains: ${name}`);
    assert.ok(!name.endsWith('/http-cache-semantics') || pkg.link, `Unexpected cache implementation: ${name}`);
  }
});

test('installed Astro consumer contract is unchanged and resolves the independent sentinel', async () => {
  const astroDir = path.join(root, 'node_modules/astro');
  const expected = {
    'dist/assets/build/remote.js': 'f373fa76e3112446db327c79b34e2bbb1ef1dcad41affb60788adf30edc9588e',
    'dist/assets/build/generate.js': '564b12c0c9aa83d573c84bd2433ee1d6b35f2f521cd803fe31c2d214cf02b30e',
  };
  for (const [relative, sha] of Object.entries(expected)) {
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(astroDir, relative))).digest('hex'), sha,
      'Astro cache callsites changed; review the boundary before updating this contract');
  }
  const { createRequire } = await import('node:module');
  const requireFromAstro = createRequire(path.join(astroDir, 'package.json'));
  assert.equal(fs.realpathSync(requireFromAstro.resolve('http-cache-semantics')),
    path.join(root, 'vendor/disabled-http-cache/index.js'));
});

test('real Astro getImage cannot fetch or register image transforms', async () => {
  const { getImage } = await import(pathToFileURL(path.join(root, 'node_modules/astro/dist/assets/internal.js')));
  const previousAsset = globalThis.astroAsset;
  const previousFetch = globalThis.fetch;
  let fetches = 0;
  let transforms = 0;
  globalThis.fetch = () => { fetches++; throw new Error('Unexpected network fetch'); };
  globalThis.astroAsset = {
    imageService: service,
    addStaticImage() { transforms++; throw new Error('Unexpected image transform registration'); },
  };
  const imageConfig = { domains: ['example.test'], remotePatterns: [], layout: 'none' };
  try {
    for (const inferSize of [false, true]) {
      await assert.rejects(getImage({ src: 'https://example.test/private.png', width: 10, height: 10, inferSize }, imageConfig), boundaryError);
    }
    await assert.rejects(getImage({ src: '/app-assets/local.png', width: 10, height: 10 }, imageConfig), boundaryError);
    assert.equal(fetches, 0);
    assert.equal(transforms, 0);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousAsset === undefined) delete globalThis.astroAsset;
    else globalThis.astroAsset = previousAsset;
  }
});

test('real Astro low-level load and revalidation cannot obtain a reusable cache policy', async () => {
  // These internal APIs are deliberately unreachable through the configured
  // image service. Fake fetches verify the sentinel, not a network boundary.
  // A throwing policy alone would NOT prevent Astro stale-on-error fallback.
  const { loadRemoteImage, revalidateRemoteImage } = await import(
    pathToFileURL(path.join(root, 'node_modules/astro/dist/assets/build/remote.js')),
  );
  for (const headers of responseHeaders) {
    const fetchFn = async () => new Response('image bytes', { status: 200, headers });
    await assert.rejects(loadRemoteImage('https://example.test/image.png', fetchFn), cacheError);
    await assert.rejects(revalidateRemoteImage('https://example.test/image.png', { etag: 'old-private-entry' }, fetchFn), cacheError);
  }
  await assert.rejects(revalidateRemoteImage('https://example.test/image.png', { etag: 'old-private-entry' },
    async () => new Response(null, { status: 304, headers: { etag: 'old-private-entry' } })), cacheError);
});

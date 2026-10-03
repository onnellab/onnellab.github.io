import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'node_modules/astro/bin/astro.mjs');

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'onnellab-image-boundary-'));
  fs.mkdirSync(path.join(dir, 'scripts'));
  fs.mkdirSync(path.join(dir, 'src/pages'), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
  fs.copyFileSync(path.join(root, 'scripts/static-image-service.mjs'), path.join(dir, 'scripts/static-image-service.mjs'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
  fs.writeFileSync(path.join(dir, 'astro.config.mjs'), `
import { defineConfig } from 'astro/config';
import { staticImageBoundary, staticImageServiceEntrypoint } from './scripts/static-image-service.mjs';
export default defineConfig({
  output: 'static',
  cacheDir: './fixture-cache',
  image: { domains: ['example.test', '127.0.0.1'], service: { entrypoint: staticImageServiceEntrypoint } },
  integrations: [staticImageBoundary()]
});
`);
  // Existing files exercise rejection in a nonempty cache directory. These
  // are not Astro hashed cache keys and do not claim to exercise a cache hit.
  // Incremental restoration is separately forbidden.
  fs.mkdirSync(path.join(dir, 'fixture-cache/assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'fixture-cache/assets/private.png'), 'PRIVATE_CACHE_BYTES');
  fs.writeFileSync(path.join(dir, 'fixture-cache/assets/private.png.json'), JSON.stringify({
    expires: Date.now() + 86400000, etag: 'private-etag', lastModified: new Date().toUTCString(),
  }));
  return dir;
}

function build(dir) {
  return spawnSync(process.execPath, [cli, 'build'], {
    cwd: dir, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
}

for (const [name, expression] of [
  ['explicit remote dimensions', "getImage({ src: 'https://example.test/private.png', width: 10, height: 10 })"],
  ['remote inferSize', "getImage({ src: 'https://example.test/private.png', inferSize: true })"],
  ['exported inferRemoteSize', "inferRemoteSize('https://example.test/private.png')"],
  ['local optimization', "getImage({ src: '/private.png', width: 10, height: 10 })"],
]) {
  test(`build rejects ${name} before network access, even with existing cache bytes`, () => {
    const dir = fixture();
    const attemptedFetch = path.join(dir, 'attempted-fetch');
    try {
      fs.writeFileSync(path.join(dir, 'src/pages/index.astro'), `---
import fs from 'node:fs';
import { getImage, inferRemoteSize } from 'astro:assets';
globalThis.fetch = () => { fs.writeFileSync(${JSON.stringify(attemptedFetch)}, 'attempt'); throw new Error('Unexpected fetch'); };
await ${expression};
---
<p>UNSAFE_IMAGE_BUILD_SUCCEEDED</p>
`);
      const result = build(dir);
      assert.notEqual(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout + result.stderr, /Astro image processing is disabled/);
      assert.equal(fs.existsSync(attemptedFetch), false);
      assert.equal(fs.existsSync(path.join(dir, 'dist/index.html')), false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

test('build rejects incremental restoration and server output', () => {
  for (const [setting, error] of [
    ["experimental: { incrementalBuild: true },", /Incremental builds require/],
    ["output: 'server',", /static, adapter-free/],
  ]) {
    const dir = fixture();
    try {
      const config = path.join(dir, 'astro.config.mjs');
      fs.writeFileSync(config, fs.readFileSync(config, 'utf8').replace("output: 'static',", setting));
      fs.writeFileSync(path.join(dir, 'src/pages/index.astro'), '<p>Unreachable</p>');
      const result = build(dir);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, error);
      assert.equal(fs.existsSync(path.join(dir, 'dist/index.html')), false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

async function listen(server) {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return server.address().port;
}

test('real dev image endpoint rejects private responses without fetching or cache headers', { timeout: 60000 }, async () => {
  let requests = 0;
  const origin = http.createServer((_req, res) => {
    requests++;
    res.writeHead(200, { 'Set-Cookie': 'private-session=do-not-share', 'Cache-Control': 'private, max-age=86400' });
    res.end('PRIVATE_ORIGIN_BYTES');
  });
  const originPort = await listen(origin);
  const portProbe = http.createServer();
  const devPort = await listen(portProbe);
  await new Promise((resolve) => portProbe.close(resolve));
  const dir = fixture();
  const marker = `Static fixture ${path.basename(dir)}`;
  fs.writeFileSync(path.join(dir, 'src/pages/index.astro'), `<p>${marker}</p>`);
  let output = '';
  const child = spawn(process.execPath, [cli, 'dev', '--ignore-lock', '--host', '127.0.0.1', '--port', String(devPort)], {
    cwd: dir, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  try {
    const start = Date.now();
    while (true) {
      try {
        const response = await fetch(`http://127.0.0.1:${devPort}/`, { signal: AbortSignal.timeout(1000) });
        if (response.ok && (await response.text()).includes(marker)) break;
      } catch {}
      if (child.exitCode !== null || child.signalCode !== null || Date.now() - start > 30000) throw new Error(`Dev server did not start: ${output}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const endpoint = new URL(`http://127.0.0.1:${devPort}/_image`);
    endpoint.searchParams.set('href', `http://127.0.0.1:${originPort}/private.png`);
    endpoint.searchParams.set('w', '10');
    endpoint.searchParams.set('h', '10');
    endpoint.searchParams.set('f', 'png');
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000), headers: { 'Cache-Control': 'max-stale=999999999' } });
    const text = await response.text();
    assert.ok(response.status >= 400);
    assert.doesNotMatch(text, /PRIVATE_ORIGIN_BYTES|private-session/);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.ok(!response.headers.get('cache-control')?.includes('31536000'));
    assert.equal(requests, 0);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = new Promise((resolve) => child.once('exit', resolve));
      child.kill('SIGTERM');
      const killTimer = setTimeout(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); }, 5000);
      try { await exited; } finally { clearTimeout(killTimer); }
    }
    assert.ok(child.exitCode !== null || child.signalCode !== null);
    assert.throws(() => process.kill(child.pid, 0), { code: 'ESRCH' });
    await new Promise((resolve) => origin.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

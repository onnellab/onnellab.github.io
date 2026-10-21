import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');

test('Pages deploy always binds live ops verification to the deployed commit', () => {
  assert.match(workflow, /verify_ops:/);
  assert.match(workflow, /repository: onnellab\/onnel-content-engine/);
  assert.match(workflow, /\.content-engine\/scripts\/verify_live_ops\.py/);
  assert.match(workflow, /--expected public\/ops\/index\.html/);
  assert.match(workflow, /--deployment-sha "\$GITHUB_SHA"/);
  assert.match(workflow, /onnellab\/ops-live-verify/);
  assert.match(workflow, /needs: \[build, deploy, verify_ops\]/);
  assert.match(workflow, /Retain sanitized verification evidence/);
});

test('historical translated image rendering and browser checks precede Pages upload', () => {
  assert.match(workflow, /python3 scripts\/test-blog-workflow-localizations\.py/);
  assert.match(workflow, /librsvg2-bin fonts-noto-core fonts-noto-cjk/);
  assert.match(workflow, /python3 scripts\/render-blog-workflow-localizations\.py/);
  assert.match(workflow, /tests\/blog-workflow-localizations\.spec\.ts/);
  assert.ok(workflow.indexOf('Render the 63 audited') < workflow.indexOf('- name: Build'));
  assert.ok(workflow.indexOf('Verify localized blog diagrams') < workflow.indexOf('- name: Upload Pages artifact'));
});


test('reviewed artwork and visual regression gates run on the existing runner before Pages upload', () => {
  assert.match(workflow, /run: npm run test:artwork/);
  assert.match(workflow, /tests\/home-showcase\.spec\.ts tests\/home-reviewed-artwork\.spec\.ts tests\/home-hero-drag\.spec\.ts/);
  assert.ok(workflow.indexOf('Verify legacy and reviewed homepage artwork') < workflow.indexOf('- name: Upload Pages artifact'));
  assert.match(workflow, /Retain homepage artwork visual evidence/);
  assert.match(workflow, /tests\/vaultxt-gallery\.spec\.ts --project=desktop --project=mobile/);
  assert.ok(workflow.indexOf('Verify VaultXT Android-only landing gallery') < workflow.indexOf('- name: Upload Pages artifact'));
  assert.match(workflow, /runs-on: ubuntu-latest/);
});

test('locked Vite tracks a security-patched release without bypassing npm audit', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lockfile = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const pinned = manifest.overrides?.vite;
  const installed = lockfile.packages?.['node_modules/vite'];
  assert.equal(typeof pinned, 'string');
  assert.equal(installed?.version, pinned, 'npm ci must use the pinned Vite build');
  const version = /^8\.(\d+)\.(\d+)$/.exec(pinned);
  assert.ok(version, 'Vite 8 version must be reviewed before changing the security pin');
  const minor = Number(version[1]), patch = Number(version[2]);
  assert.ok(minor > 3 || (minor === 3 && patch >= 3) ||
            (minor === 2 && patch >= 4) || (minor === 1 && patch >= 6),
            'known vulnerable Vite 8 patch levels are forbidden');
  assert.equal(installed.resolved, `https://registry.npmjs.org/vite/-/vite-${pinned}.tgz`);
  assert.match(installed.integrity, /^sha512-[A-Za-z0-9+/]+={0,2}$/);
  assert.ok(workflow.indexOf('npm audit --package-lock-only --include=dev --audit-level=high') <
            workflow.indexOf('run: npm ci'), 'security audit must remain fail-closed before install');
});

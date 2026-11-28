import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');

test('Pages deploy always binds live ops verification to the deployed commit', () => {
  const verify = workflow.split('\n  verify_ops:\n')[1]?.split(/\n  \w+:\n/)[0];
  assert.ok(verify, 'Live ops must remain a separate Pages job');
  assert.match(verify, /needs: deploy/);
  assert.match(verify, /contents: read/);
  assert.match(verify, /ref: \$\{\{ github\.sha \}\}/);
  assert.doesNotMatch(verify, /repository:|secrets\.|continue-on-error:/);
  assert.match(verify, /python3 scripts\/test-verify-live-ops\.py/);
  assert.match(verify, /python3 scripts\/verify_live_ops\.py/);
  assert.match(verify, /--expected public\/ops\/index\.html/);
  assert.match(verify, /--deployment-sha "\$GITHUB_SHA"/);
  assert.match(workflow, /onnellab\/ops-live-verify/);
  assert.match(workflow, /needs: \[build, deploy, verify_ops\]/);
  assert.match(verify, /Retain sanitized verification evidence/);
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

test('locked Vite remains pinned to a reviewed version', () => {
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
});

test('Pages installs the locked tree without lifecycle scripts and the independent audit remains', () => {
  const audit = fs.readFileSync(path.join(root, '.github/workflows/dependency-security.yml'), 'utf8');
  assert.match(workflow, /^\s*run: npm ci --ignore-scripts$/m);
  assert.doesNotMatch(workflow, /^\s*run: npm audit\b/m);
  assert.doesNotMatch(workflow, /pages_description="[^"\n]*audit/i);
  assert.match(audit, /npm audit --package-lock-only --include=dev --audit-level=high/);
  assert.match(audit, /schedule:/);
});

test('reviewed minimum patched Zod and Undici versions cannot regress in lockfile', () => {
  const lockfile = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const dependencies = [
    { name: 'zod', major: 4, minimumMinor: 6, minimumPatch: 6 },
    { name: 'undici', major: 8, minimumMinor: 12, minimumPatch: 2 },
  ];
  for (const { name, major, minimumMinor, minimumPatch } of dependencies) {
    const pkg = lockfile.packages?.[`node_modules/${name}`];
    assert.ok(pkg, `${name} must remain explicitly locked`);
    const parsed = /^(\d+)\.(\d+)\.(\d+)$/.exec(pkg.version ?? '');
    assert.ok(parsed, `${name} requires an auditable stable semver`);
    const [, lockedMajor, lockedMinor, lockedPatch] = parsed.map(Number);
    assert.equal(lockedMajor, major, `${name} major upgrades require explicit review`);
    assert.ok(
      lockedMinor > minimumMinor ||
      (lockedMinor === minimumMinor && lockedPatch >= minimumPatch),
      `${name} reverted to a version with a previously reported High-severity advisory`,
    );
    assert.equal(pkg.resolved, `https://registry.npmjs.org/${name}/-/${name}-${pkg.version}.tgz`);
    assert.match(pkg.integrity ?? '', /^sha512-[A-Za-z0-9+/]+={0,2}$/);
  }
});


test('IndexNow is bound to a successful main deployment and kept outside Pages result gates', () => {
  assert.match(workflow, /run: python3 scripts\/test-search-discovery\.py/);
  assert.ok(workflow.indexOf('Prepare public search discovery manifest') > workflow.indexOf('- name: Build'));
  assert.ok(workflow.indexOf('Prepare public search discovery manifest') < workflow.indexOf('- name: Upload Pages artifact'));
  assert.match(workflow, /search_discovery:[\s\S]*?needs: \[build, deploy\]/);
  assert.match(workflow, /name: search-discovery-state/);
  assert.match(workflow, /needs: \[build, deploy, verify_ops\]/);
});

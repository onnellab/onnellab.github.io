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

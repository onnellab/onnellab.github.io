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

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const plugin = new URL(`file://${require.resolve('@semantic-release/npm')}`);
const { default: getRegistry } = await import(new URL('./lib/get-registry.js', plugin));
const { OFFICIAL_REGISTRY } = await import(new URL('./lib/definitions/constants.js', plugin));
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));

test('publishConfig selects the npm plugin OIDC path', () => {
  // The plugin's OIDC branch uses exact string equality, including the slash.
  assert.equal(getRegistry(pkg, { cwd: process.cwd(), env: {} }), OFFICIAL_REGISTRY);
  assert.equal(pkg.publishConfig.access, 'public');
});

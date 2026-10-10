import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const tool = path.join(root, 'tools', 'validate-generated.mjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'brown-validator-'));

function run(file) {
  try { return JSON.parse(execFileSync(process.execPath, [tool, file], { encoding: 'utf8' })); }
  catch (error) { return JSON.parse(String(error.stdout || '[]')); }
}

test('valida JavaScript correto com node --check', () => {
  const file = path.join(temp, 'ok.js');
  fs.writeFileSync(file, 'const answer = (value) => value + 1;\n');
  assert.deepEqual(run(file)[0], { file, ok: true, status: 'valid', errors: [] });
});

test('retorna erro concreto para JavaScript inválido', () => {
  const file = path.join(temp, 'broken.js');
  fs.writeFileSync(file, 'function broken( {\n');
  const item = run(file)[0];
  assert.equal(item.ok, false);
  assert.equal(item.status, 'invalid');
  assert.ok(item.errors.length > 0);
});

test('valida JSON correto e rejeita JSON inválido', () => {
  const good = path.join(temp, 'ok.json');
  const bad = path.join(temp, 'broken.json');
  fs.writeFileSync(good, '{"ready":true}\n');
  fs.writeFileSync(bad, '{"ready":}\n');
  assert.equal(run(good)[0].ok, true);
  assert.equal(run(bad)[0].ok, false);
});

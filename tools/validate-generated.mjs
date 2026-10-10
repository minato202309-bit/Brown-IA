#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node tools/validate-generated.mjs <arquivo> [...]');
  process.exit(2);
}

function result(file, ok, status, errors = []) {
  return { file, ok, status, errors };
}

const output = [];
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!fs.existsSync(file)) {
    output.push(result(file, false, 'error', ['Arquivo não encontrado.']));
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.trim()) {
    output.push(result(file, false, 'error', ['Arquivo vazio.']));
    continue;
  }
  if (ext === '.json') {
    try { JSON.parse(source); output.push(result(file, true, 'valid')); }
    catch (error) { output.push(result(file, false, 'invalid', [error.message])); }
    continue;
  }
  if (['.js', '.mjs', '.cjs'].includes(ext)) {
    const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (check.status === 0) output.push(result(file, true, 'valid'));
    else output.push(result(file, false, 'invalid', String(check.stderr || check.stdout || 'Falha de sintaxe.').trim().split(/\r?\n/).slice(0, 12)));
    continue;
  }
  if (['.html', '.htm'].includes(ext)) {
    const errors = [];
    if (!/<html\b/i.test(source)) errors.push('Elemento <html> não encontrado.');
    if (!/<body\b/i.test(source)) errors.push('Elemento <body> não encontrado.');
    if (!/<\/html>\s*$/i.test(source)) errors.push('Fechamento </html> não encontrado no final.');
    output.push(result(file, errors.length === 0, errors.length ? 'invalid' : 'valid', errors));
    continue;
  }
  output.push(result(file, null, 'unavailable', [`Validação sintática automática não implementada para ${ext || 'este formato'}.`]));
}

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
process.exit(output.some(item => item.ok === false) ? 1 : 0);

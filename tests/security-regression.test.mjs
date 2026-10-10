import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const config = fs.readFileSync(path.join(root, 'config.js'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8');

const concreteGeminiKey = /(?:AIza|AQ\.)[A-Za-z0-9_-]{20,}/;

test('não há chave concreta no frontend, config ou workflow', () => {
  assert.equal(concreteGeminiKey.test(app), false);
  assert.equal(concreteGeminiKey.test(html), false);
  assert.equal(concreteGeminiKey.test(config), false);
  assert.equal(concreteGeminiKey.test(workflow), false);
  assert.match(config, /Object\.freeze\(\{\}\)/);
});

test('CSP principal restringe origem e conexão ao provedor conhecido', () => {
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /default-src 'self'/);
  assert.match(html, /object-src 'none'/);
  assert.match(html, /connect-src 'self' https:\/\/generativelanguage\.googleapis\.com/);
  assert.match(html, /referrer/);
});

test('URLs externas aceitam somente HTTP e HTTPS', () => {
  assert.match(app, /function safeExternalUrl\(value\)/);
  assert.match(app, /\['http:', 'https:'\]\.includes\(url\.protocol\)/);
  assert.match(app, /safeHref\(url\)/);
  assert.doesNotMatch(app, /href="\$1"[^\n]*javascript/i);
});

test('preview usa sandbox sem same-origin e CSP sem rede externa', () => {
  assert.match(app, /setAttribute\('sandbox', 'allow-scripts'\)/);
  assert.match(app, /connect-src \\'none\\'/);
  assert.match(app, /frame-src \\'none\\'/);
  assert.match(app, /worker-src \\'none\\'/);
  assert.match(app, /event\.source !== frame\.contentWindow/);
  assert.match(app, /\['error', 'resource', 'loaded'\]\.includes/);
});

test('conteúdo de anexos e prompts possui limites antes do envio', () => {
  assert.match(app, /MAX_ATTACHMENT_BYTES = 8 \* 1024 \* 1024/);
  assert.match(app, /MAX_TEXT_ATTACHMENT_CHARS = 120000/);
  assert.match(app, /MAX_PROMPT_CHARS = 120000/);
  assert.match(app, /content\.length > MAX_PROMPT_CHARS/);
  assert.match(app, /supportedAttachment\(file\)/);
});

test('exportação não inclui apiKey e erros sanitizam credenciais', () => {
  assert.match(app, /function sanitizeErrorMessage/);
  assert.match(app, /replace\(\/AIza/);
  assert.match(app, /replace\(\/AQ\\\./);
  const exportStart = app.indexOf('function exportAllLocalData');
  const exportEnd = app.indexOf('async function deleteAllLocalData');
  assert.ok(exportStart >= 0 && exportEnd > exportStart);
  assert.doesNotMatch(app.slice(exportStart, exportEnd), /apiKey/);
});

test('streaming não repete requisição quando recebe resposta vazia', () => {
  assert.match(app, /if \(streamError\) throw new Error\(streamError\)/);
  assert.match(app, /if \(!text\.trim\(\)\) throw new Error\(t\('responseEmpty'\)\)/);
});

test('workflow não injeta segredos e versiona os assets', () => {
  assert.doesNotMatch(workflow, /secrets\./);
  assert.match(workflow, /GITHUB_SHA/);
  assert.equal(workflow.includes("app\\.js\\?v="), true);
  assert.equal(workflow.includes("styles\\.css\\?v="), true);
});

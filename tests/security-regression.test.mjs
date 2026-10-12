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
  assert.match(html, /https:\/\/esm\.run/);
  assert.match(html, /https:\/\/huggingface\.co/);
  assert.match(html, /wasm-unsafe-eval/);
  assert.match(html, /referrer/);
});

test('modelo local é explícito, executa via WebGPU e não substitui o Gemini', () => {
  const localModel = fs.readFileSync(path.join(root, 'local-model.js'), 'utf8');
  assert.match(html, /data-model-provider="local"/);
  assert.match(html, /Brown Local/);
  assert.match(html, /local-model-panel/);
  assert.match(html, /local-model\.js/);
  assert.match(localModel, /@mlc-ai\/web-llm/);
  assert.match(localModel, /Qwen2\.5-Coder-7B-Instruct-q4f16_1-MLC/);
  assert.match(localModel, /Qwen2\.5-Coder-7B-Instruct-q4f32_1-MLC/);
  assert.match(localModel, /shader-f16/);
  assert.match(localModel, /'gpu' in navigator/);
  assert.match(localModel, /powerPreference: mobile \? 'low-power' : 'high-performance'/);
  assert.match(localModel, /isMobileDevice/);
  assert.match(localModel, /\.\.\.history\.map\(message =>/);
  assert.match(localModel, /max_tokens: maxTokens/);
  assert.match(app, /state\.provider === 'local' \? await localModelReply/);
  assert.match(app, /window\.BrownLocalModel\.reply/);
  assert.match(app, /if \(window\.BrownLocalModel\.isLoaded\?\.\(\)\)/);
  assert.match(app, /Modelo carregado e mantido ativo/);
});

test('seletor de modelo fica junto do raciocínio e o perfil não ocupa mais o menu', () => {
  assert.match(html, /class="model-picker"/);
  assert.match(html, /id="modelButton"/);
  assert.match(html, /id="modelMenu"/);
  assert.match(html, /data-model-provider="gemini"/);
  assert.match(html, /data-model-provider="local"/);
  assert.doesNotMatch(html, /01 \/ (?:PERFIL|PROFILE)/);
  assert.doesNotMatch(html, /id="profileList"/);
  assert.match(app, /\$\('#profileList'\)\?\.addEventListener/);
  assert.match(app, /selectModelProvider\(provider, autoLoad = false\)/);
  assert.match(app, /ensureLocalModel\(\)\.catch/);
});

test('banner de privacidade registra o listener antes da renderização final', () => {
  const listener = app.indexOf('initPrivacyControls();');
  const finalRender = app.indexOf('applyTranslations();');
  assert.ok(listener >= 0 && finalRender > listener);
  assert.match(app, /function applyPrivacyChoice\(choice\).*hidePrivacyBanner\(\)/);
  assert.match(app, /PRIVACY_CONSENT_KEY/);
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

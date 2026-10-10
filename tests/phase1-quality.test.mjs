import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

test('o modelo mais capaz é o padrão e nomes mortos foram removidos', () => {
  assert.match(app, /const MODEL_TIERS = \{/);
  assert.match(app, /max: \['gemini-3\.8-flash'/);
  assert.match(app, /function pickModel\(names, tier = 'max'\)/);
  assert.match(app, /pickModel\(names, 'max'\)/);
  // nomes desligados ou inexistentes não podem voltar
  assert.doesNotMatch(app, /gemini-1\.5-flash/);
  assert.doesNotMatch(app, /'gemini-2\.0-flash'/);
  assert.doesNotMatch(app, /gemini-3\.8-flash-lite'/);
  assert.doesNotMatch(app, /flash\.\*lite\/i\.test\(name\)/);
});

test('o raciocínio usa thinkingConfig real nos modelos Gemini 3', () => {
  assert.match(app, /const THINKING_LEVELS = \{ LEVE: 'LOW', MEDIO: 'MEDIUM', ALTO: 'HIGH', EXTREMO: 'HIGH' \}/);
  assert.match(app, /if \(\/\^gemini-3\/i\.test\(String\(state\.model \|\| ''\)\)\) generationConfig\.thinkingConfig = \{ thinkingLevel: THINKING_LEVELS\[state\.thinking\] \|\| 'MEDIUM' \}/);
});

test('o prompt de sistema define identidade, voz e continuidade', () => {
  assert.match(app, /IDENTIDADE/);
  assert.match(app, /COMO VOCÊ FALA/);
  assert.match(app, /CONTINUIDADE/);
  assert.match(app, /Nunca abra com/);
  assert.match(app, /Não repita o pedido do usuário antes de responder/);
  assert.match(app, /CÓDIGO E ARQUIVOS/);
});

test('a memória da conversa é resumida em vez de descartada', () => {
  assert.match(app, /const SUMMARY_KEY = 'brown-ia-summaries-v1'/);
  assert.match(app, /async function chatSummary\(dropped\)/);
  assert.match(app, /const summaryText = dropped\.length >= 4 \? await chatSummary\(dropped\) : ''/);
  assert.match(app, /RESUMO DAS PARTES ANTERIORES DESTA CONVERSA/);
  assert.match(app, /async function deleteAllLocalData\(\) \{ storageRemove\(SUMMARY_KEY\);/);
});

test('orçamento de histórico usa caracteres reais e não corta mensagens cedo', () => {
  assert.match(app, /const historyBudget = Math\.min\(600000, Math\.max\(60000, Math\.round\(modelInput \* 2\.4\)\)\)/);
  assert.doesNotMatch(app, /\(modelInput - 7000\) \* 3\.2/);
  assert.doesNotMatch(app, /slice\(0, codeTask \? 24000 : 9000\)/);
});

test('limites de saída permitem arquivos completos', () => {
  assert.match(app, /const expandedOutput = codeTask \? 65536 : 24576;/);
  assert.match(app, /state\.thinking === 'ALTO' \? 32768 : 49152/);
});

test('o estado da conexão é coerente após troca de idioma', () => {
  assert.match(app, /function refreshConnectionText\(\)/);
  assert.match(app, /refreshConnectionText\(\); return locale; \}/);
  assert.match(app, /state\.lastError = message \|\| t\('keyError'\)/);
});

test('download de resposta usa Blob e não data: URL', () => {
  assert.doesNotMatch(app, /href="data:text\/markdown/);
  assert.match(app, /if \(action === 'download'\) \{ downloadBlob\(new Blob\(\[message\.content\]/);
});
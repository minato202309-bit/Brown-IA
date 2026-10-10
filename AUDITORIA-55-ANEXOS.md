# Brown IA — Auditoria 55: anexos gerados

## Problema reproduzido

O parser só reconhecia de forma confiável o formato `FILE: nome.ext` antes do bloco de código. Respostas comuns como `### index.html`, ` ```html index.html` ou apenas ` ```javascript` permaneciam como texto sem cartão de arquivo.

## Correção

- Reconhecimento de blocos Markdown com linguagens adicionais.
- Reconhecimento de títulos Markdown contendo nomes de arquivos.
- Reconhecimento de nome no cabeçalho do fence, como `html index.html`.
- Fallback automático para nomes como `brown-arquivo-1.js` quando o modelo não informar nome.
- Preservação de múltiplos arquivos no mesmo texto.
- Cartões acionáveis com **Visualizar**, **Abrir**, **Baixar** e **ZIP**.
- HTML incompleto continua sendo rejeitado como arquivo para evitar download truncado.

## Testes executados

- `node --check app.js` — aprovado.
- `git diff --check` — aprovado.
- Chromium: `FILE: index.html` — detectado.
- Chromium: `### index.html` — detectado.
- Chromium: ` ```html index.html` — detectado.
- Chromium: bloco JavaScript sem nome — fallback `.js` detectado.
- Chromium: HTML + CSS múltiplos — dois cartões detectados.
- Chromium: download individual + ZIP — dois cliques acionados pelos Blob downloads.

## Limitação

A Brown não pode anexar um arquivo físico ao servidor sem backend. O download é criado localmente no navegador usando `Blob` e `ObjectURL`, que é o comportamento correto para um site estático no GitHub Pages.

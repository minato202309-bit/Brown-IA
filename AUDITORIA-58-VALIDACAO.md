# Brown IA — Auditoria 58: base de validação automática

## Escopo

Implementação incremental focada em código gerado. O fluxo Gemini, streaming, histórico, anexos, cartões e downloads existentes foram preservados.

## Alterações

- `app.js`
  - Mantém JSON inválido e HTML estruturalmente incompleto nos cartões para que a falha seja exibida, em vez de descartar silenciosamente o arquivo.
  - Valida JSON com `JSON.parse`.
  - Valida JavaScript simples em Web Worker isolado usando o parser do runtime, sem executar o corpo no contexto principal.
  - Marca `import/export`, TypeScript, JSX e formatos sem validador dedicado como indisponíveis, sem afirmar que estão válidos.
  - Executa validação automaticamente depois de uma resposta com arquivos e também oferece o botão `Validar`.
  - Exibe erros concretos e oferece `Corrigir com Brown`, preenchendo o composer com o erro e o nome do arquivo.
  - Mantém a prévia HTML em iframe `sandbox="allow-scripts"`, com bridge para reportar exceções JavaScript, rejeições de Promise e falhas de carregamento de recursos.
  - Persiste resultados de validação junto à mensagem.
- `styles.css`
  - Adiciona apenas estilos dos estados de validação e da ação de correção.
- `tools/validate-generated.mjs`
  - Validação real fora do navegador: `node --check` para JavaScript, `JSON.parse` para JSON e validação estrutural básica para HTML.
- `tests/validate-generated.test.mjs`
  - Testes de JavaScript válido/inválido e JSON válido/inválido.
- `docs/VALIDATION.md`
  - Documenta o desenho, o comando CLI e as limitações.
- `index.html`
  - Atualiza os parâmetros de cache para `validation-58`.

## Testes executados

- `node --check app.js` — aprovado.
- `node --check config.js` — aprovado.
- `node --test tests/validate-generated.test.mjs` — 3 testes aprovados.
- `git diff --check` — aprovado.
- Smoke test Chromium com cartão real contendo JavaScript e JSON inválidos — cartões e botões apareceram; erros concretos foram renderizados; ação de correção foi encontrada.
- Smoke test Chromium com HTML — cartão, botão `Validar` e botão `Testar sandbox` apareceram; validação estrutural retornou `VÁLIDO`.

## Limitações verificadas

- O Chromium headless utilizado para o teste bloqueou a abertura de nova janela, inclusive com clique de entrada simulado; por isso não foi possível observar a janela da prévia nesse ambiente. A arquitetura de iframe sandboxed e o bridge foram implementados, mas a captura de erro em uma janela real precisa ser confirmada em navegador interativo Android/desktop.
- A validação JavaScript no navegador cobre JavaScript clássico simples. Módulos ES (`import/export`) são marcados como indisponíveis e devem ser validados pelo CLI Node.
- TypeScript, JSX, CSS, Python, dependências e comportamento funcional não são declarados válidos automaticamente.
- A validação estrutural não prova que um jogo ou projeto atende aos requisitos nem substitui execução/testes funcionais.

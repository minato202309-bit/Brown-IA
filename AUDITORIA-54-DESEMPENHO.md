# Brown IA — Auditoria 54: desempenho, streaming e arquivos gerados

## Correções aplicadas

- **Streaming SSE:** respostas do Gemini agora podem aparecer progressivamente no cartão correto, com fallback controlado para `generateContent` quando o streaming não estiver disponível.
- **Concorrência e estado:** o envio cria uma única resposta provisória, atualiza essa resposta durante o streaming e remove o estado provisório ao concluir; `state.busy` é restaurado em sucesso e erro.
- **Métricas:** `window.__BROWN_LAST_METRICS__` registra `uiPrepMs`, `promptPrepMs`, `providerMs`, `totalMs`, `renderMs` e, quando aplicável, `streaming: true`. As métricas não incluem prompts, respostas ou chaves.
- **Idioma do provedor:** a instrução de idioma escolhido agora é enviada explicitamente ao modelo em PT-BR, English ou Español.
- **Arquivos completos:** blocos HTML só são tratados como arquivo quando têm `<html>`, `<body>` e fechamento `</html>`. JSON continua sujeito a validação sintática.
- **Ações de arquivo:** arquivos gerados têm ações reais de **Visualizar** (iframe sandbox), **Abrir** (Blob em nova aba), **Baixar** e **ZIP**. O conteúdo não é executado na página principal.
- **Interface:** identidade terminal premium reforçada com trilhos de cor, camadas, bordas técnicas, animações discretas e redução respeitada por `prefers-reduced-motion`, sem dependências externas.

## Testes executados

- `node --check app.js` — aprovado.
- `node --check config.js` — aprovado.
- `git diff --check` — aprovado.
- Chromium real: extração de HTML completo e Markdown — aprovado.
- Chromium real: HTML incompleto rejeitado — aprovado.
- Chromium real: cartões com Visualizar/Abrir/Baixar e ZIP — aprovado.
- Download interceptado do arquivo individual — clique acionado — aprovado.
- Abertura isolada do arquivo em `_blank` com `noopener,noreferrer` — aprovado.
- ZIP gerado no navegador, acentos conferidos pelo `zipfile` Python e `unzip -t` — aprovado.
- Payload simulado PT-BR/English/Español — diretiva de idioma presente — aprovado.
- SSE simulado com dois chunks — texto completo e ordem preservada — aprovado.
- Envio completo simulado — uma mensagem de usuário + uma resposta, `busy: false`, sem duplicação — aprovado.
- Brick Breaker em fixture HTML isolado: inicialização, loop, teclado, ponteiro/toque, reinício e ausência de overflow em 1024×768 e 390×844 — aprovado.
- Capturas reais desktop e Android — sem overflow horizontal; redesign aplicado.

## Pendências e limites

- O streaming depende de o endpoint/modelo Gemini aceitar `streamGenerateContent`; quando não aceitar, o código tenta a requisição normal.
- A aplicação continua sendo um frontend estático: a chave BYOK é usada no navegador. Não há chave universal pública.
- A validação de jogos verifica estrutura HTML e oferece teste em sandbox, mas não pode provar semanticamente que toda lógica de jogo atende à intenção do usuário.
- Não foi feita chamada real ao Gemini nesta auditoria; os testes de rede usam respostas simuladas para não expor credenciais nem consumir quota.

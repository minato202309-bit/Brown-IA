# Validação de código gerado

A Brown agora possui três camadas complementares:

1. **Validação no navegador:** JSON é analisado com `JSON.parse`. JavaScript simples é analisado em um Web Worker isolado, sem executar o corpo do código no contexto principal. TypeScript/JSX e formatos sem parser dedicado são marcados como indisponíveis.
2. **Pré-visualização sandboxed:** HTML pode ser aberto somente por ação explícita em um iframe com `sandbox="allow-scripts"`. Um bridge coleta exceções JavaScript não tratadas, rejeições de Promise e falhas de carregamento de recursos, sem permitir acesso à origem principal.
3. **Validação real no ambiente Node:** `tools/validate-generated.mjs` usa `node --check` para JavaScript e `JSON.parse` para JSON. HTML recebe validação estrutural básica. O comando não executa o programa gerado.

A validação não prova que um jogo ou projeto atende aos requisitos. Ela apenas identifica os erros que cada camada consegue observar. CSS, Python, TypeScript, JSX, dependências externas e comportamento funcional continuam pendentes quando não há parser ou ambiente isolado específico.

Uso:

```bash
node tools/validate-generated.mjs arquivo.js dados.json
node --test tests/validate-generated.test.mjs
```

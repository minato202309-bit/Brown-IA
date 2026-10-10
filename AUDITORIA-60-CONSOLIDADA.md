# Brown IA — Auditoria 60 consolidada

**Data:** 10/10/2026
**Escopo:** revisão e correção do projeto atual em `/home/ubuntu/Brown-IA-repo`, sem chamadas reais ao Gemini, sem pedir chaves e sem revelar segredos.

## Resumo

A Brown IA permanece uma aplicação web estática em HTML, CSS e JavaScript. Não existe backend neste repositório. A integração Gemini continua sendo feita diretamente pelo navegador quando o usuário fornece uma chave BYOK. Isso foi preservado porque não seria correto inventar um backend ou alterar a hospedagem GitHub Pages sem uma infraestrutura autorizada.

Foram corrigidos problemas verificáveis de segurança da prévia, validação de URLs, limites de entrada, streaming, cache e testes. A aplicação foi carregada localmente no navegador e os fluxos principais foram encontrados no DOM. Não foi feita chamada real ao Gemini.

## Severidade e situação

| Severidade | Item | Situação | Evidência |
|---|---|---|---|
| Crítica | Chave BYOK diretamente no navegador | **Pendente arquitetural** | `app.js` envia `x-goog-api-key`; não há backend |
| Alta | Ausência de autenticação e rate limit próprio | **Pendente arquitetural** | GitHub Pages/static frontend não aplica controle por usuário |
| Alta | Preview de HTML/JS não confiável | **Corrigido na aplicação** | sandbox sem `allow-same-origin`, CSP interna com `connect-src 'none'`, `frame-src 'none'` e validação de mensagens |
| Média | URLs e renderização de Markdown | **Corrigido e testado estaticamente** | `safeExternalUrl()` aceita somente `http:`/`https:`; conteúdo passa por escaping |
| Média | Prompt sem limite explícito | **Corrigido** | `MAX_PROMPT_CHARS = 120000`; envio acima do limite é interrompido com mensagem localizada |
| Média | Streaming podia repetir requisição em corpo vazio ou erro HTTP | **Corrigido** | erros SSE/HTTP são tratados sem fallback duplicado; resposta vazia vira erro |
| Média | Cache poderia manter assets antigos | **Corrigido** | `index.html` usa `audit-60`; workflow continua versionando com `GITHUB_SHA` |
| Baixa | Documentação tinha perfis obsoletos | **Corrigido** | `docs/ARCHITECTURE.md` agora reflete `BROWN` e `CODE` |

## Segurança

### Segredos

Não foi encontrada nenhuma chave ou token concreto no frontend, `config.js`, workflow ou arquivos verificados. Também foi executada busca por valores concretos nos padrões Gemini no histórico Git analisado. Nenhum valor foi revelado.

O arquivo `config.js` continua sem segredo:

```js
window.BROWN_CONFIG = Object.freeze({});
```

A aplicação ainda aceita uma chave BYOK no navegador porque esse é o modo funcional atual. A chave só é persistida quando o usuário autoriza a opção correspondente. Exportações locais não incluem `state.apiKey`.

### XSS, HTML e URLs

A renderização de mensagens começa com `escapeText()`. Blocos de código, tabelas, nomes de arquivos, títulos, mensagens de erro e atributos dinâmicos continuam escapados antes de serem inseridos em templates.

Foi adicionada uma validação explícita de URL:

- `safeExternalUrl()` usa o parser nativo `URL`.
- Somente `http:` e `https:` são aceitos.
- Esquemas como `javascript:`, `data:` e `file:` não são transformados em links.
- Links usam `target="_blank"` com `rel="noopener noreferrer"`.

Ainda existem usos de `innerHTML`, mas os valores dinâmicos encontrados estão escapados ou são textos/estruturas fixas controladas. Isso foi coberto por testes estáticos, não por uma prova formal de ausência de XSS em todos os futuros commits.

### CSP principal

`index.html` contém CSP adicional com:

- `default-src 'self'`;
- `object-src 'none'`;
- `form-action 'self'`;
- `script-src 'self'`;
- `connect-src 'self' https://generativelanguage.googleapis.com`;
- `worker-src 'self' blob:`;
- `frame-src 'self' blob:`;
- `Referrer-Policy: no-referrer`.

Como está em meta tag, não substitui cabeçalhos HTTP reais. Para proteção mais forte, o host/CDN deve publicar esses controles como headers.

### Preview sandbox

A prévia continua em iframe com apenas `sandbox="allow-scripts"`. Portanto, não recebe `allow-same-origin`, acesso ao `localStorage` da aplicação, acesso à DOM principal ou às chaves.

Foi adicionada uma CSP dentro do documento gerado:

- `default-src 'none'`;
- `connect-src 'none'`;
- `frame-src 'none'`;
- `child-src 'none'`;
- `worker-src 'none'`;
- `object-src 'none'`;
- imagens e mídia somente `data:`/`blob:`;
- sem navegação externa permitida pela política.

A ponte `postMessage` agora exige o token da prévia, verifica `event.source === frame.contentWindow` e aceita somente `error`, `resource` e `loaded`. A janela contêiner não recebe a CSP do conteúdo, evitando bloquear o próprio iframe.

A validação de JavaScript usa `new Function` somente dentro de um Web Worker para compilação sintática. Não há `eval` ou `Function` no contexto principal da aplicação. O código gerado não é executado na página principal.

## Gemini e tratamento de erros

Confirmado:

- A chave é enviada diretamente no cabeçalho `x-goog-api-key` em `app.js`.
- Não há backend neste projeto.
- A validação da chave tem timeout de 10 segundos.
- Geração tem timeout de 35 segundos para conversas comuns e 90 segundos para código, anexos ou expansões.
- Limites de entrada e saída usam os limites retornados pelo provedor, com teto local de histórico e saída.
- Erros HTTP e erros recebidos em SSE são sanitizados.
- Credenciais presentes em mensagens de erro são substituídas por `[credencial omitida]`.
- Uma resposta SSE vazia não dispara uma segunda requisição automática ao Gemini.
- Respostas truncadas por `MAX_TOKENS` continuam sendo sinalizadas e podem usar uma continuação limitada.

Não verificável nesta execução:

- validade de uma chave;
- quota, billing, modelo disponível ou latência real do Google;
- comportamento de erro específico de uma conta Gemini;
- custo de produção;
- funcionamento de CORS do provedor em outra origem.

## Anexos, persistência e privacidade

Confirmado no código:

- anexos acima de 8 MB são rejeitados;
- arquivos vazios são rejeitados;
- texto acima de 120.000 caracteres é rejeitado;
- MIME e extensão são comparados;
- texto é decodificado antes de ser enviado como texto;
- PDF e imagens, quando suportados pelo fluxo, são enviados como `inlineData` ao provedor conectado;
- histórico e configurações são normalizados ao carregar;
- conversas são ordenadas por `updatedAt` antes do limite de 100;
- exportações de dados não incluem a chave BYOK;
- exclusão local remove conversas, configurações, consentimento, chave e IndexedDB quando disponível;
- não há analytics, marketing ou rastreadores opcionais no código verificado.

Limitações restantes:

- `localStorage` não é transacional entre várias abas;
- o histórico local pode ser apagado pelo navegador ou ficar sem espaço;
- apagar dados locais não apaga dados já enviados ao Google;
- a política de privacidade ainda precisa dos dados reais do controlador, contato e encarregado;
- não há garantia de retenção ou exclusão em terceiros.

## IA para código

O prompt atual exige:

1. entender o pedido;
2. planejar;
3. implementar arquivos completos;
4. revisar requisitos, estados e segurança;
5. validar somente o que realmente puder ser validado;
6. declarar limitações sem inventar testes, APIs, arquivos ou ações.

Também trata anexos, páginas, links e código como dados não confiáveis e instrui a ignorar prompt injection contida nesses dados.

A aplicação possui extração de arquivos Markdown, download individual, ZIP, validação sintática de JavaScript/JSON e verificação estrutural básica de HTML. Ainda não possui um agente com ferramentas reais para executar testes completos de todas as linguagens, pesquisa web verificável, leitura automática de URLs ou correção iterativa autônoma.

## Arquivos alterados nesta etapa

- `app.js`
  - validação de URLs;
  - limite de prompts;
  - CSP própria da prévia;
  - validação mais rigorosa da ponte `postMessage`;
  - tratamento de erro/streaming sem requisição duplicada.
- `index.html`
  - versão de cache `audit-60` nos assets.
- `docs/ARCHITECTURE.md`
  - perfis e níveis atualizados para a implementação real.
- `tests/security-regression.test.mjs`
  - testes de segredos, CSP, XSS/URLs, preview, anexos, persistência/exportação, streaming e workflow.

Arquivos anteriores já presentes no working tree, como `styles.css`, `AUDITORIA-59-COMPLETA.md`, `PROMPT-SISTEMA-BROWN-CODE.md`, `docs/VALIDATION.md` e `tests/validate-generated.test.mjs`, foram preservados.

## Testes executados e resultados

- `node --check app.js` — **passou**.
- `node --test tests/*.test.mjs` — **11 testes passaram, 0 falhas**.
- Busca de segredos concretos no working tree — **nenhum encontrado**.
- Busca por segredos concretos no histórico Git analisado — **nenhum encontrado**.
- `git diff --check` — **passou**.
- Servidor HTTP local — **respondeu corretamente**.
- Verificação do HTML servido — CSP e `audit-60` presentes.
- Navegador local — página carregou com título `Brown · Workspace`.
- Inspeção DOM — menu, configurações, composer, anexos, privacidade, raciocínio e CSP presentes.

Não foram executados:

- chamadas reais ao Gemini;
- testes com chave, senha ou dado pessoal;
- teste físico em Android;
- teste em todos os navegadores;
- auditoria de headers do GitHub Pages publicado;
- teste de quota/billing;
- pentest completo;
- análise jurídica de conformidade LGPD.

## Configurações externas necessárias

Para uso pessoal com BYOK:

- criar uma chave Gemini própria;
- restringi-la ao Gemini API quando possível;
- não publicá-la no repositório;
- não compartilhar a mesma chave com usuários públicos;
- revisar quota e billing no Google.

Para uso público profissional:

- criar backend/proxy HTTPS;
- colocar a chave somente em variável de ambiente ou secret manager;
- adicionar autenticação ou sessão controlada;
- aplicar rate limit e limites de payload;
- registrar somente métricas redigidas;
- publicar CSP, Referrer-Policy e demais headers no servidor/CDN;
- definir controlador, contato, retenção e fluxo LGPD.

## Próximos passos

1. Não adicionar chave universal ao frontend.
2. Se a aplicação for pública, implementar o backend seguro antes de habilitar Gemini para terceiros.
3. Adicionar testes de navegador em aparelhos Android reais para anexos, downloads e prévia.
4. Reavaliar o uso de `innerHTML` em futuras alterações e preferir APIs DOM seguras.
5. Implementar ferramentas reais de validação somente quando houver ambiente isolado e backend apropriado.

### Referências de segurança

[1]: https://ai.google.dev/gemini-api/docs/api-key "Google Gemini API key security"
[2]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html "OWASP Cross Site Scripting Prevention Cheat Sheet"

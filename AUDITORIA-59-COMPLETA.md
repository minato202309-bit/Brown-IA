# Brown IA — Auditoria técnica e correções 59

**Data:** 10/10/2026
**Escopo:** código atual do repositório `/home/ubuntu/Brown-IA-repo`, com foco em segurança, integração Gemini, geração de código/arquivos, persistência, UX e limitações de arquitetura.

## Resultado executivo

A aplicação atual é uma SPA estática em HTML/CSS/JavaScript. Ela funciona em modo local sem provedor e, quando o usuário fornece uma chave BYOK, faz requisições diretamente do navegador ao endpoint Gemini. Isso é funcional para uso pessoal, mas **não é uma arquitetura segura para uma aplicação pública multiusuário**: uma chave colocada no navegador pode ser extraída e o GitHub Pages não fornece backend, segredo de servidor, autenticação ou rate limit de aplicação.

Foram aplicadas correções pequenas e não destrutivas:

- CSP e `Referrer-Policy` foram adicionados ao `index.html`.
- A comunicação da prévia sandbox passou a validar origem lógica (`event.source`), tipo de evento e tamanho do erro.
- `Open` não abre mais HTML gerado diretamente como página executável; HTML usa a prévia isolada e os demais formatos são abertos como texto.
- Downloads passaram a anexar temporariamente o elemento `<a>` ao DOM, melhorando compatibilidade móvel.
- O prompt do modelo passou a tratar anexos, links, páginas e código como dados não confiáveis e a não reproduzir credenciais.

## 1. Segurança

### Confirmado no código

- **Chave universal concreta:** não foi encontrada no código atual nem no workflow.
- **Histórico Git:** a busca automatizada por padrões reais `AQ.<valor>` e `AIza<valor>` não encontrou valores concretos nas linhas de alteração analisadas. Há commits históricos com os termos de remoção/hardening, mas não foi exposta uma credencial neste relatório.
- **BYOK:** a chave é mantida em memória e só é colocada no `localStorage` se o usuário marcar a opção de salvar. Isso reduz persistência acidental, mas não protege contra XSS, extensão maliciosa ou inspeção do navegador.
- **Endpoint:** `app.js` envia a chave no cabeçalho `x-goog-api-key` diretamente ao Google. O navegador continua sendo um cliente privilegiado.
- **Renderização de mensagens:** `formatContent()` começa escapando texto; tabelas, links e blocos de código são reconstruídos com conteúdo já escapado. Os links externos usam `noopener noreferrer`.
- **Prévia:** a execução ocorre em iframe `sandbox="allow-scripts"`, sem `allow-same-origin`. A janela auxiliar religa mensagens para o app; a validação agora exige `event.source === opened`, token aleatório e tipos permitidos.
- **Código JavaScript gerado:** a validação usa `new Function` dentro de Web Worker para compilação sintática, não no contexto principal. Isso não é execução do programa, mas continua sendo uma área que deve ser revisada caso o worker seja alterado.

### Riscos ainda pendentes

| Nível | Risco | Impacto | Correção necessária |
|---|---|---|---|
| Crítico | Chave BYOK em frontend público | Pode ser extraída e usada para consumir quota/cobrar o projeto | Backend/proxy próprio, segredo em variável de ambiente/secret manager, autenticação e rate limit |
| Alto | Sem autenticação e sem rate limit de aplicação | Abuso, spam e custos no provedor | Backend com quotas por usuário/IP, limites de payload e observabilidade sem prompts/chaves |
| Alto | CSP em `<meta>` não substitui cabeçalho HTTP | Alguns controles têm cobertura limitada em hospedagem estática | Configurar cabeçalhos no host/CDN ou backend; manter a meta como camada adicional |
| Médio | `innerHTML` continua usado para templates controlados | Uma futura interpolação não escapada pode reintroduzir DOM XSS | Manter `escapeText`, preferir `textContent`/DOM APIs e adicionar testes de regressão |
| Médio | `window.open` continua necessário para a janela da prévia | A superfície de comunicação entre janelas exige manutenção cuidadosa | Preferir modal/iframe no mesmo documento com sandbox, se o redesign permitir |
| Baixo | Mensagens do modelo podem conter links externos | Risco de phishing/saída do site, não execução automática pelo app | Manter HTTPS, `noopener noreferrer`, destacar domínio e pedir ação explícita para navegação |

A documentação oficial do Google recomenda não expor chaves em aplicações cliente de produção e usar backend/proxy. A OWASP recomenda encoding contextual, sinks seguros e sanitização quando HTML precisa ser permitido.

## 2. Qualidade da IA para programação

### Fatos confirmados

- O modelo é escolhido dinamicamente em `validateGeminiKey()` a partir dos modelos disponíveis para a chave, priorizando variantes Flash/Flash-Lite.
- A conversa é convertida para `contents` em `geminiReply()`, com histórico local e instruções de sistema adicionadas como texto.
- O idioma, perfil (`BROWN`/`CODE`) e raciocínio (`LEVE`, `MEDIO`, `ALTO`, `EXTREMO`) alteram instruções e configuração de geração.
- O limite de saída é calculado em `geminiReply()` e limitado pelo `outputTokenLimit` retornado pelo provedor. Isso é um teto, não uma garantia de resposta completa.
- Há streaming com `alt=sse`; o texto é atualizado progressivamente por `updateStreamingMessage()`.
- `finishReason === MAX_TOKENS` é tratado como truncamento e o usuário é informado.
- Arquivos em blocos Markdown são extraídos por `extractCodeFiles()`. JavaScript e JSON têm validação real em `validateGeneratedFileSyntax()`; HTML usa estrutura básica e a prévia reporta erros de runtime/recursos.
- A aplicação oferece download individual e ZIP, mas não possui compilador/testes completos para todas as linguagens.

### Limitações concretas

1. Não há agente autônomo com ciclo verificável completo **entender → planejar → implementar → revisar → validar → corrigir**. Existem instruções no prompt, mas não chamadas de ferramenta para executar testes reais e devolver evidência.
2. Não há pesquisa web real, leitura automática de URL ou sistema de citações verificáveis neste frontend.
3. JavaScript/JSON têm validação sintática; HTML/CSS/TS/Python e projetos maiores não têm validação equivalente completa.
4. A prévia é adequada para HTML simples, mas não garante que dependências externas, APIs, canvas complexo ou recursos mobile funcionarão.
5. O tempo de resposta depende do provedor, rede, fila e modelo. O app possui timeout, mas não consegue acelerar o backend do Google.
6. O histórico é local e pode ser perdido se o usuário limpar o site, ficar sem espaço ou usar outro dispositivo.

## 3. Estado, persistência e concorrência

- `state.busy` é definido antes de aguardar `fileReady`/`providerReady`, impedindo envios simultâneos pelo fluxo normal.
- `requestSeq` e `requestChatId` evitam aplicar uma resposta antiga à conversa errada.
- Conversas são ordenadas por `updatedAt` antes do limite de 100 em `persist()`.
- IDs, projetos, idioma e configurações são normalizados durante a carga.
- Falhas de armazenamento são sinalizadas por `state.storageAvailable` e mensagem local.

Pendência: a persistência em `localStorage` não é transacional nem multiaba. Duas abas abertas simultaneamente podem sobrescrever dados; IndexedDB seria mais apropriado para anexos e histórico grande.

## 4. Privacidade e LGPD

A política existente em `privacidade.html` e `POLITICA-DE-PRIVACIDADE.md` informa que controlador, contato, CNPJ e encarregado ainda precisam ser preenchidos. Isso é correto: não se deve inventar uma entidade responsável.

A política também informa:

- dados locais, finalidade e exclusão;
- armazenamento opcional da chave BYOK;
- compartilhamento necessário com Gemini quando conectado;
- ausência de promessa de anonimato, criptografia ponta a ponta ou exclusão em terceiros;
- exportação e exclusão locais;
- necessidade de validar transferências internacionais e retenção diretamente com o controlador/provedor.

**Não é possível declarar conformidade jurídica apenas a partir do frontend.** O responsável precisa revisar bases legais, controlador, contato, retenção, contratos com provedores e fluxo de atendimento ao titular.

## 5. UX, acessibilidade e desempenho

Há suporte a navegação por teclado em controles principais, `aria-label` em ações e `prefers-reduced-motion` no CSS. O layout é responsivo, mas o teste físico em vários Android não é substituto por emulação: precisa ser feito em aparelhos reais.

Medições disponíveis no próprio app separam preparação de UI, primeiro token e duração total. Não há benchmark externo confiável nesta execução porque isso exigiria uma chave válida, uma rede controlada e chamadas reais ao provedor.

## 6. Arquivos alterados nesta etapa

- `index.html`: `Referrer-Policy` e CSP adicional.
- `app.js`: isolamento/verificação de mensagens da prévia, abertura segura de arquivos gerados, downloads móveis e defesa contra prompt injection em conteúdo recebido.
- `AUDITORIA-59-COMPLETA.md`: este relatório.

## 7. Testes executados

- `node --check app.js` — **passou**.
- `node --test tests/validate-generated.test.mjs` — **passou: 3 testes, 0 falhas**.
- Varredura estática de segredos no working tree — nenhum valor concreto encontrado; padrões de sanitização (`AIza`/`AQ.`) permanecem intencionalmente para ocultar credenciais em erros.
- Varredura histórica Git por valores concretos — nenhum valor que corresponda aos padrões reais foi encontrado na análise automatizada.
- Inspeção de diff e funções de requisição/preview — realizada.

Não foi declarado teste real contra Gemini porque uma chave não deve ser solicitada nem incluída no artefato. Não foi declarado teste físico em Android, auditoria de rede real, teste de quota, teste de todos os navegadores ou conformidade jurídica.

## 8. Próxima evolução recomendada

1. **Emergência:** revogar chaves já compartilhadas em chats/repositórios, verificar uso/quota, remover qualquer chave histórica e configurar restrição da chave somente à API Gemini.
2. **Essencial:** criar backend mínimo com segredo no ambiente, autenticação, rate limit, limites de tamanho e logs redigidos.
3. **Confiabilidade:** adicionar testes de navegador automatizados para anexos, histórico, projetos, downloads e prévia sandbox.
4. **Programação:** implementar um pipeline explícito de planejamento/revisão/validação com artefatos estruturados e evidência de cada etapa.
5. **Escala:** trocar histórico grande por IndexedDB/backend, adicionar observabilidade de latência sem armazenar prompts e proteger custos por usuário.

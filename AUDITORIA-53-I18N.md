# Brown-IA — Auditoria 53: idioma global e acabamento visual

## Implementação

A Brown-IA agora possui um dicionário central `I18N` com Português do Brasil, English e Español. A função `applyTranslations()` atualiza imediatamente textos, títulos, descrições, placeholders, rótulos de acessibilidade, opções de seleção, prompts rápidos e estados da interface. A troca não recarrega a página e não altera o conteúdo original das mensagens já salvas.

A opção Automático usa `navigator.languages` e `navigator.language`, priorizando espanhol, inglês e português conforme o navegador. Quando nenhum idioma suportado é encontrado, o fallback é Português do Brasil. A preferência escolhida continua sendo persistida em `brown-ia-settings-v1` e restaurada na inicialização.

Renderizações dinâmicas também usam o idioma atual: conversas, projetos, ações de mensagens, links destacados, arquivos gerados, anexo pendente, exportação Markdown, estados de conexão, validação de chave, privacidade, erros de arquivo, confirmações e mensagens de modo local.

O visual do redesign 52 foi preservado: fundo quase preto, vermelho predominante, bordas iluminadas, cartões profundos, indicadores de terminal, detalhes verdes de conexão e animações discretas. A atualização de cache passou para `i18n-53`.

## Correções adicionais

Foram preservados ícones de ações durante a tradução, evitando que a troca de idioma substitua o conteúdo visual completo de botões. Prompts rápidos agora alteram tanto o rótulo quanto o texto enviado ao selecionar a ação. Rótulos do raciocínio, latência, envio, configurações, anexos e acessibilidade acompanham o idioma atual. Quando uma chave não existe, o sistema usa o valor de fallback em português ou uma string vazia, nunca exibindo chaves internas como `settings.title`.

A página de política de privacidade permanece como documento jurídico operacional em português, conforme a versão oficial atualmente documentada; ela não recebe tradução automática parcial para evitar apresentar uma tradução jurídica incompleta como documento final.

## Testes realmente executados

| Teste | Resultado |
|---|---|
| `node --check app.js` | Aprovado |
| `git diff --check` | Aprovado |
| Carregamento real no Chromium após cache bypass | Aprovado |
| Troca imediata PT-BR → English → Español | Aprovado |
| Atualização de título, `lang` do documento e meta description | Aprovado |
| Atualização de menu, configurações, botão de envio e placeholders | Aprovado |
| Atualização de rótulo de raciocínio, nível e estado de latência | Aprovado |
| Persistência de Español após recarregar | Aprovado |
| Automático usando idioma detectado pelo navegador | Aprovado; Chromium de teste resolveu para English |
| Prompts rápidos com rótulo e comando traduzidos | Aprovado |
| Renderização dinâmica de mensagens, ações, links e feedback | Aprovado |
| Conversas e projetos usando textos do idioma ativo | Aprovado por renderização real |
| Ausência de erro de inicialização JavaScript | Aprovado |

## Pendências explícitas

A chamada ao provedor Gemini continua dependendo de uma chave BYOK válida e a linguagem das respostas do modelo é solicitada por instrução de sistema; isso não transforma respostas históricas em traduções retroativas. A política pública separada continua em português por segurança documental e precisa de revisão humana antes de ser tratada como documento jurídico final.

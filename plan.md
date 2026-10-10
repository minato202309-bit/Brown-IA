# Redesign da Brown-IA — Workspace editorial em três zonas

## Direção visual

- **Movimento:** produto premium de IA com estética dark editorial/command center, inspirado na referência enviada sem reproduzir sua composição literal.
- **Princípios:** clareza antes de decoração; superfícies em camadas; ações com hierarquia evidente; densidade confortável e foco central na conversa.
- **Paleta:** carvão quase preto como base; grafite e azul-chumbo para superfícies; vermelho escarlate como ação e marca; verde suave somente para conexão; âmbar para avisos.
- **Layout:** três zonas com funções explícitas — navegação e sessão à esquerda, conversa no centro, contexto/capacidades à direita. A terceira zona some abaixo de 1240px e o rail vira gaveta no celular.
- **Assinaturas:** monograma B em cápsula angular, linha de status superior, marcadores técnicos e detalhes de grade muito discretos.
- **Interação:** botões arredondados, foco visível, hover com elevação curta e estados ativos por borda/brilho controlado; `prefers-reduced-motion` desativa animações.
- **Tipografia:** sans de sistema para leitura; monospace para metadados, status, ações técnicas e arquivos.
- **Essência:** uma estação de trabalho de IA com opinião e capacidade de execução. Personalidade: precisa, confiante, humana.
- **Voz visual:** headlines curtas e CTAs objetivos. Exemplos: “Conversa pronta.” e “Escolha um ponto de partida e vamos construir.”
- **Marca:** B em moldura arredondada com cantos técnicos, BROWN em tracking amplo e subtítulo de sistema.

## Organização estrutural

O `index.html` mantém os controles funcionais existentes no rail esquerdo, concentra a conversa e o composer no canal central, e adiciona um `context-rail` independente para identidade, próximos passos, capacidades e sessão. O `styles.css` define a hierarquia, estados, animações e responsividade; `app.js` continua responsável apenas pelo estado e comportamento, sem depender do conteúdo decorativo da nova coluna.

## Implementação

`index.html` preserva todos os IDs, atributos de acessibilidade, controles e fluxos. `app.js` não é reescrito: o comportamento atual de chats, projetos, perfis, idioma, raciocínio, BYOK, anexos, exportações, ações por mensagem e privacidade continua sendo a fonte de verdade. `styles.css` será reorganizado integralmente em camadas legíveis, cobrindo estados renderizados dinamicamente e breakpoints desktop/mobile.

## Restrições

Sem dependências ou imagens novas. O redesign não deve gerar overflow horizontal, remover controles, introduzir chamadas de rede ou alterar a persistência/API. A validação deve cobrir sintaxe, carregamento real no Chromium, interação dos menus/configurações, envio local, anexo, exportações, projetos, consentimento e viewport móvel.

## Fase 4 — referência aplicada com organização explícita

A interface agora assume uma navegação principal visível no rail esquerdo (Chat, Projetos, Workspace, Memória, Arquivos e Personalidade), um hero central da Brown com atalhos de Criar, Programar e Analisar, e uma coluna direita dedicada a Conversas recentes e Ferramentas. A referência foi usada como direção de produto e hierarquia, não como cópia literal de conteúdo ou distribuição.

## Fase 5 — menu premium

A navegação recebeu SVGs inline consistentes, tipografia Space Grotesk/DM Sans, descrições curtas, estados ativo/hover, indicadores luminosos e espaçamento de componente. O menu deixou de ser uma lista de caracteres e passou a funcionar como uma área de produto com identidade própria.

## Fase 6 — leitura e funções inferiores

As áreas inferiores do rail foram transformadas em cartões de sessão, idioma, perfil, privacidade e configurações, com acentos laterais diferentes e estados de hover. A conversa passou a usar DM Sans em tamanho confortável e entrelinha ampla; headings usam Space Grotesk e blocos de código preservam a fonte monoespaçada.

## Fase 7 — presença de marca

O logo da Brown foi ampliado no cabeçalho, hero, contexto, avatar das respostas e estado vazio. A arte Charlie Brown Jr. foi adicionada como marca d’água de baixo contraste no fundo da conversa e como textura sutil em um card lateral, preservando contraste e legibilidade.

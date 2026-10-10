# Redesign da Brown-IA — Interface moderna e profissional

## Direção visual

- **Movimento:** produto premium de IA com estética dark editorial/command center, substituindo o terminal rígido por uma estação de trabalho refinada.
- **Princípios:** clareza antes de decoração; superfícies em camadas; ações com hierarquia evidente; densidade confortável e foco central na conversa.
- **Paleta:** carvão quase preto como base; grafite e azul-chumbo para superfícies; vermelho escarlate como ação e marca; verde suave somente para conexão; âmbar para avisos.
- **Layout:** rail lateral com navegação + painel de conversa amplo, com bordas suaves e mais respiro; no celular, o rail vira a mesma gaveta existente.
- **Assinaturas:** monograma B em cápsula angular, linha de status superior, marcadores técnicos e detalhes de grade muito discretos.
- **Interação:** botões arredondados, foco visível, hover com elevação curta e estados ativos por borda/brilho controlado; `prefers-reduced-motion` desativa animações.
- **Tipografia:** sans de sistema para leitura; monospace para metadados, status, ações técnicas e arquivos.
- **Essência:** uma estação de trabalho de IA com opinião e capacidade de execução. Personalidade: precisa, confiante, humana.
- **Voz visual:** headlines curtas e CTAs objetivos. Exemplos: “Conversa pronta.” e “Escolha um ponto de partida e vamos construir.”
- **Marca:** B em moldura arredondada com cantos técnicos, BROWN em tracking amplo e subtítulo de sistema.

## Implementação

`index.html` preserva todos os IDs, atributos de acessibilidade, controles e fluxos. `app.js` não é reescrito: o comportamento atual de chats, projetos, perfis, idioma, raciocínio, BYOK, anexos, exportações, ações por mensagem e privacidade continua sendo a fonte de verdade. `styles.css` será reorganizado integralmente em camadas legíveis, cobrindo estados renderizados dinamicamente e breakpoints desktop/mobile.

## Restrições

Sem dependências ou imagens novas. O redesign não deve gerar overflow horizontal, remover controles, introduzir chamadas de rede ou alterar a persistência/API. A validação deve cobrir sintaxe, carregamento real no Chromium, interação dos menus/configurações, envio local, anexo, exportações, projetos, consentimento e viewport móvel.

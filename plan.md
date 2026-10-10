# Redesign da Brown-IA — Auditoria visual

## Direção visual

- **Movimento:** terminal cyber-industrial premium, inspirado em uma central de operações de IA e não em um dashboard genérico.
- **Princípios:** hierarquia forte, vermelho como sinal de ação, superfícies profundas em camadas, densidade controlada e foco no conteúdo da conversa.
- **Paleta:** preto carvão como base; grafite e aço para superfícies; vermelho escarlate para marca, ações e estados de atenção; cinza frio para suporte; verde apenas para conexão válida e confirmações, preservando significado sem competir com o vermelho.
- **Layout:** rail lateral de operações + canal principal de conversa; no celular, o rail vira gaveta fixa acionada pelo menu existente.
- **Assinaturas:** molduras angulares discretas, grid técnico/scanline de baixa opacidade e indicadores monoespaçados de estado.
- **Interação:** controles mostram claramente foco, hover, seleção, erro e sucesso; animações são curtas e removíveis por `prefers-reduced-motion`.
- **Tipografia:** fontes de sistema para não criar requisições externas; sans-serif para leitura e monospace para estados, metadados e comandos.
- **Essência:** uma estação de trabalho de IA direta para conversar, pesquisar, programar e gerar arquivos. Personalidade: precisa, intensa, confiável.
- **Voz visual:** ações como “ENVIAR”, “CONECTAR” e “NOVA CONVERSA” são comandos objetivos; nenhum texto decorativo substitui uma função.
- **Marca:** monograma B em uma moldura de terminal, com barra de status e sinal vermelho controlado.

## Implementação

`index.html` preserva todos os IDs, atributos de acessibilidade, controles e fluxos. `app.js` não é reescrito: o comportamento atual de chats, projetos, perfis, idioma, raciocínio, BYOK, anexos, exportações, ações por mensagem e privacidade continua sendo a fonte de verdade. `styles.css` será reorganizado integralmente em camadas legíveis, cobrindo estados renderizados dinamicamente e breakpoints desktop/mobile.

## Restrições

Sem dependências ou imagens novas. O redesign não deve gerar overflow horizontal, remover controles, introduzir chamadas de rede ou alterar a persistência/API. A validação deve cobrir sintaxe, carregamento real no Chromium, interação dos menus/configurações, envio local, anexo, exportações, projetos, consentimento e viewport móvel.

# Brown-IA — Auditoria 52: redesign completo da interface

## Escopo

A interface foi redesenhada com estética de terminal cyber-industrial premium. O vermelho escarlate agora é a cor principal de marca, ação e foco; preto carvão, grafite e cinza frio formam as superfícies; verde continua reservado a conexão e confirmações. Não foram adicionadas dependências, fontes remotas, imagens ou chamadas de rede.

## Preservação funcional

A lógica de `app.js` não foi reescrita. Permaneceram os IDs, eventos e fluxos existentes para conversas, memória local, projetos, perfis Brown/Code, idioma, níveis de raciocínio, conexão BYOK, anexos, arquivos gerados, exportações, ações por mensagem e privacidade/cookies. A alteração funcional no HTML foi somente a atualização dos query strings de cache para `redesign-52`.

O `styles.css` foi reorganizado para cobrir os elementos estáticos e os elementos gerados dinamicamente: lista de conversas, projetos, ações de mensagem, links destacados, Markdown, tabelas, blocos de código, cartões de arquivos, anexos, configurações, privacidade, estados de foco e estados móveis.

## Melhorias visuais

A nova interface usa camadas de painéis, molduras de terminal, indicadores monoespaçados, brilho vermelho controlado, scanline/grid de baixa opacidade, entrada suave de mensagens, destaque de foco, feedback de hover e gaveta lateral no celular. O `prefers-reduced-motion` reduz as animações para usuários que solicitaram menos movimento.

No celular, o menu existente vira uma gaveta fixa com botão de abertura/fechamento, a área do compositor permanece acessível, os controles respeitam áreas de toque e o banner de privacidade se adapta sem overflow horizontal.

## Testes realmente executados

- `node --check app.js` — aprovado.
- `node --check config.js` — aprovado.
- `git diff --check` — aprovado.
- Contagem de chaves do CSS: 316 aberturas e 316 fechamentos — aprovada.
- Chromium real desktop em 1440×920: carregamento, composição visual e estados de conexão — aprovado.
- Chromium real móvel em 390×844: sem overflow horizontal, banner dentro da viewport e compositor presente — aprovado.
- Menu lateral: abrir — aprovado.
- Configurações: abrir — aprovado.
- Seletor de raciocínio: abrir e selecionar Alto — aprovado.
- Perfil Code: selecionar e atualizar tags/canal — aprovado.
- Idioma: selecionar English e atualizar tag/note — aprovado.
- Anexo TXT: pré-visualizar e remover — aprovado.
- Envio local: mensagem e resposta, recuperação de `state.busy` e latência — aprovado.
- Projeto: criar e renderizar no menu — aprovado.
- Exportação JSON: Blob e ação de download — aprovado.
- Privacidade: abrir painel, revogar consentimento e reexibir banner — aprovado.
- Ações por mensagem: feedback positivo, editar, copiar após sucesso de clipboard — aprovado.
- Arquivos gerados: cartão individual, download individual e ZIP — aprovado.

## Observação

A inspeção usou Chromium em viewport móvel, não um aparelho Android físico. A integração Gemini continua dependendo de uma chave válida fornecida pelo usuário ou de um backend seguro; o redesign não altera esse fluxo nem expõe credenciais.

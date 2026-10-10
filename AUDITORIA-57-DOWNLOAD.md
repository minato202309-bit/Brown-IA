# Brown IA — Auditoria 57: entrega de arquivo sem ruído

## Problemas corrigidos

- Código sem linguagem explícita deixava o arquivo como `.txt` mesmo quando era HTML ou JavaScript.
- O modelo podia repetir o código inteiro quando o usuário pedia somente o download.
- O cartão apresentava Visualizar, Abrir e Baixar mesmo quando as duas primeiras ações não eram necessárias.
- A resposta mantinha um download adicional de Markdown, confundindo o arquivo real com a sessão.

## Alterações

- Inferência de extensão pelo conteúdo: HTML, CSS, JSON, Python, JavaScript/TypeScript, XML e texto.
- Detecção do pedido “somente arquivo/download” e preservação dessa intenção na mensagem da resposta.
- Quando o modo somente-arquivo é usado, o código não é repetido visualmente na conversa: aparece uma mensagem curta e o cartão do arquivo.
- Cartão redesenhado sem alterar o restante do layout: nome, tipo, tamanho e um único botão principal **Baixar arquivo**.
- Botão ZIP aparece somente quando existem vários arquivos.
- Remoção do `.md` da resposta quando um arquivo real foi detectado.
- Prompt interno ajustado para impedir links `data:text` falsos e instruções manuais de copiar/colar.

## Testes executados

- `node --check app.js` — aprovado.
- `git diff --check` — aprovado.
- Chromium: HTML sem linguagem — detectado como `.html`.
- Chromium: JavaScript sem linguagem — detectado como `.js`.
- Chromium: pedido “não me mande o código, só me mande o arquivo para baixar” — modo somente-arquivo detectado.
- Chromium: cartão com um único botão de download e sem botões de Visualizar/Abrir — aprovado.

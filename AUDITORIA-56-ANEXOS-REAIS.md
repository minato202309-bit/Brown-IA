# Brown IA — Auditoria 56: anexos reais após respostas cortadas

## Falha confirmada

A detecção anterior só processava blocos Markdown fechados com três crases. Quando o modelo encerrava a resposta antes de enviar o fence final, todo o código aparecia como texto e nenhum cartão de arquivo era renderizado.

## Correção

- Fences abertos no fim da resposta agora também são processados.
- HTML bruto contendo `<!doctype html>` ou `<html>` e `</html>` agora gera arquivo mesmo sem fence Markdown.
- O nome é obtido de títulos como `### jogo.html`, do cabeçalho `html jogo.html` ou recebe fallback `.html`, `.js`, `.css` etc.
- O cartão renderizado mantém Visualizar, Abrir, Baixar e ZIP.
- O download continua local, via Blob/ObjectURL, sem executar o código na página principal.

## Testes reais executados

- `node --check app.js` — aprovado.
- `git diff --check` — aprovado.
- Fence HTML sem fechamento — `jogo.html` detectado.
- HTML bruto sem fence — `brown-arquivo-1.html` detectado.
- JavaScript sem fence final — `brown-arquivo-1.js` detectado.
- Renderização no Chromium — cartão, botão de download e ZIP presentes.

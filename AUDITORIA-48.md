# Brown-IA — auditoria estrutural 48

## Alterações aplicadas

A versão foi revisada contra os doze pontos da auditoria recebida.

| Área | Correção |
|---|---|
| Imagens | PNG/JPEG e demais imagens compatíveis entram na requisição como `inlineData` com MIME e base64 reais. |
| Anexos antigos | O envio usa somente `state.pendingFile`; o caminho automático de `lastFile`/IndexedDB foi removido. |
| Projetos | Projetos têm ID, nome e conversas associadas; é possível abrir/filtrar, renomear, excluir e associar chats. |
| Concorrência | `state.busy` e `requestSeq` impedem envios simultâneos e associam resposta ao chat original. |
| Conexão | Estado de conexão e estado da última requisição são separados; falha não vira `GEMINI READY`. |
| Dados inválidos | Mensagens, chats, IDs e projetos são normalizados antes do carregamento. |
| Idioma/raciocínio | Idioma e nível de raciocínio inválidos retornam para padrões seguros. |
| Arquivos incompatíveis | Formatos não suportados são bloqueados com mensagem clara; imagem, PDF, texto, código, JSON, XML e CSV são aceitos. |
| Truncamento | Continuação é limitada a uma tentativa adicional; se ainda houver `MAX_TOKENS`, a Brown informa que a resposta foi interrompida. |
| Histórico | O limite de armazenamento foi ampliado de 20 para 100 conversas, com ordenação por atualização. |
| Markdown | Foram adicionados títulos, negrito, itálico, listas, código inline, blocos de código e links seguros. |
| API | A chave deixou de ser colocada na URL e passou para o cabeçalho `x-goog-api-key`; nenhuma URL completa com a chave é registrada. |

## Testes reais

Executados em Chromium local:

1. JSON inválido em mensagens, chats e projetos sem quebrar a interface: **passou**.
2. Idioma inválido retornando a `pt-BR`: **passou**.
3. Markdown seguro com título, negrito e bloco de código: **passou**.
4. Filtro de projeto exibindo somente o chat associado: **passou**.
5. Dois envios rápidos produzindo apenas um usuário e uma resposta: **passou**.
6. Imagem PNG enviada em `inlineData` com MIME `image/png`: **passou**.
7. Segundo envio sem seleção de arquivo não reutilizando a imagem anterior: **passou**.
8. Fonte sem `?key=` na URL do Gemini: **passou**.
9. `node --check app.js`: **passou**.
10. `git diff --check`: **passou**.

Observação: o teste de imagem usa uma resposta simulada do provedor para verificar o payload produzido pelo navegador. A validação de visão real depende de uma chave Gemini válida e de cota disponível.

## Limitações ainda arquiteturais

A chave continua no navegador porque o projeto é um frontend estático. O uso público mais seguro exige um backend intermediário. O pacote não contém nenhuma chave.

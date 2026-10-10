# Brown-IA — Auditoria 50

## Resultado

A auditoria foi executada sobre o código atual e no Chromium local. Foi encontrada e corrigida uma falha real: ao selecionar um arquivo inválido depois de um arquivo válido, o anexo anterior permanecia pendente e poderia ser reenviado sem intenção. Agora toda rejeição limpa o anexo pendente e a pré-visualização.

## Arquivos alterados

- `app.js`
  - validação de MIME compatível com extensão;
  - rejeição de arquivos vazios;
  - rejeição de arquivos acima de 8 MB;
  - rejeição de texto acima de 120.000 caracteres;
  - limpeza de anexos antigos após qualquer rejeição ou falha de leitura;
  - remoção do caminho operacional de chave universal;
  - sanitização de credenciais em mensagens de erro;
  - listas Markdown com `ul`/`ol` sem remover o escaping existente.
- `index.html`
  - rótulos acessíveis para chave, mensagem, arquivo e botões iconográficos;
  - atributos de menu/raciocínio para teclado e leitores de tela;
  - cache local atualizado para `audit-50`.
- `styles.css`
  - nenhuma mudança visual estrutural nesta auditoria; a versão é atualizada pelo cache.
- `.github/workflows/pages.yml`
  - versionamento automático por SHA para `config.js`, `app.js` e `styles.css`;
  - nenhuma chave ou segredo usado no workflow.

## Testes executados

| Área | Resultado |
|---|---|
| `node --check app.js` e `node --check config.js` | passou |
| `git diff --check` | passou |
| YAML do workflow com PyYAML | passou |
| Simulação da versão de cache para os três assets | passou |
| TXT, CSV, Markdown, JSON, XML, HTML, CSS, JS, TS, Python e SVG | passou; cada marcador foi encontrado no payload textual, sem `inlineData` |
| PDF e PNG | passou; enviados como `inlineData` com MIME correto |
| Arquivo vazio | passou; rejeitado e anexo anterior limpo |
| Arquivo acima de 8 MB | passou; rejeitado e anexo anterior limpo |
| Texto acima de 120.000 caracteres | passou; rejeitado e anexo anterior limpo |
| MIME incompatível com extensão | passou; rejeitado e anexo anterior limpo |
| Dois envios rápidos | passou; apenas uma requisição e botão bloqueado durante processamento |
| Falha de rede | passou; mensagem clara, status `GEMINI ERROR` e botão liberado |
| Resposta bem-sucedida após falha | fluxo de recuperação verificado no mock do provedor |
| Histórico com 150 conversas | passou; 100 mantidas e a conversa ativa preservada |
| Migração do histórico legado | passou |
| JSON inválido no armazenamento | passou; inicialização controlada |
| Idioma `auto` | passou; restaurado e persistido |
| Salvamento opcional de chave | passou; desmarcado não salva, marcado salva localmente |
| XSS em HTML, atributos, Markdown, links e código | passou; nenhum `script`, evento HTML ou link `javascript:` criado |
| Tabela, listas e bloco de código | passou; tabela, `ul`, `ol` e `pre` presentes |
| Cópia sem permissão | passou; não exibiu sucesso falso |
| Exportação Markdown/JSON | passou; conteúdo presente |
| ZIP com acento, arquivo vazio e JSON inválido | passou; somente arquivo válido entrou, o ZIP foi validado com `unzip -t` e o nome Unicode foi preservado |
| Responsividade em viewport 390 px | passou; sem overflow horizontal, composer e raciocínio presentes |
| Deploy do Pages no commit `3afd03b` | passou; workflow concluído e assets publicados com versão SHA |

Os testes de Gemini utilizaram respostas simuladas para não consumir chaves. Nenhuma chave foi inserida no código, no pacote ou no relatório.

## Segurança do código atual e do deploy

- `config.js` público está vazio e não contém credencial.
- O workflow não contém `secrets`, `BROWN_UNIVERSAL_KEY` ou injeção de chave.
- A chave BYOK só é gravada quando o checkbox de consentimento é marcado.
- O cache de cada deploy passa a usar os primeiros 12 caracteres do SHA do commit.
- Erros da API são limitados e têm padrões de credenciais mascarados antes de serem exibidos ou persistidos.

## Pendências reais

1. **Histórico Git remoto:** a análise de todos os blobs encontrou três commits antigos com valor em formato de credencial no `config.js`. O branch e o site atuais estão limpos, mas apagar esses blobs do histórico exige reescrever o histórico e fazer `git push --force`. Essa operação não foi executada porque é destrutiva para clones e referências existentes e requer autorização explícita.
2. **Pesquisa web real:** não existe backend de busca, leitor real de URLs ou sistema de citações verificadas. O app não deve afirmar que abriu ou pesquisou links.
3. **PDF:** o PDF é transmitido como binário; extração local de texto ainda não existe.
4. **Validação de código:** arquivos gerados são validados quanto a nome, tamanho, conteúdo vazio e JSON; não são executados automaticamente.
5. **Backend seguro:** BYOK no navegador continua sendo compatibilidade para GitHub Pages. Para uso público, é necessário backend/proxy com controle de abuso e proteção de credenciais.

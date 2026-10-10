# Brown IA — Plano seguro de migração de privacidade 62

**Data:** 10/10/2026
**Status:** somente análise e planejamento. Nenhuma mudança de visibilidade, Pages, acesso, deploy, branch, commit ou chamada ao Gemini foi executada.

## Estado atual confirmado

O repositório `minato202309-bit/Brown-IA` continua **público** e o branch padrão é `main`. O GitHub Pages continua configurado e acessível em:

`https://minato202309-bit.github.io/Brown-IA/`

A publicação usa GitHub Actions com `actions/upload-pages-artifact@v3`, configurada para enviar a raiz inteira (`path: .`) para o Pages. O workflow versiona `config.js`, `app.js` e `styles.css` e publica o artefato.

O site atual não foi interrompido. O working tree contém alterações locais anteriores e novos relatórios, mas nenhuma alteração foi enviada ao GitHub nesta análise.

## Dependências atuais do GitHub Pages

O `index.html` referencia diretamente:

- `styles.css`;
- `config.js`;
- `app.js`;
- `privacidade.html` por link de navegação.

Não foram encontrados outros assets locais obrigatórios no HTML atual. O frontend também depende de recursos externos no navegador:

- endpoint `https://generativelanguage.googleapis.com` para chamadas Gemini quando o usuário fornece BYOK;
- `https://aistudio.google.com/api-keys` como link para obtenção de chave;
- APIs nativas do navegador, como `localStorage`, IndexedDB, `Blob`, Web Worker, `fetch` e `URL.createObjectURL`.

O site pode carregar em modo local sem Gemini. Para respostas Gemini, o navegador atual depende diretamente do provedor e da chave BYOK inserida pelo usuário.

## Arquivos que precisam permanecer no repositório público de publicação

Para preservar o site atual sem refatoração imediata, o repositório público de publicação precisa conter pelo menos:

| Arquivo | Motivo |
|---|---|
| `index.html` | Documento principal servido pelo Pages; contém a estrutura e as referências aos assets. |
| `styles.css` | Estilos usados pelo documento principal. |
| `app.js` | Toda a lógica atual de interface, armazenamento, anexos, preview, downloads, i18n e integração Gemini no navegador. |
| `config.js` | É carregado pelo HTML; atualmente está vazio e não contém segredo. Pode ser removido somente em uma alteração futura coordenada com o HTML. |
| `privacidade.html` | É referenciado pelo HTML e deve continuar disponível para o link de política. |
| `.github/workflows/pages.yml` | Necessário no repositório de publicação se o Pages continuar sendo implantado por GitHub Actions. |

A CSP, a política de privacidade e os textos de interface permanecem visíveis porque fazem parte do frontend entregue ao navegador. A política de privacidade não contém segredo e deve permanecer pública se o site continuar público.

O repositório público não precisa conter, para o funcionamento do Pages:

- `AUDITORIA-*.md`;
- `docs/`;
- `tests/`;
- `tools/`;
- `plan.md`;
- `PROMPT-SISTEMA-BROWN-CODE.md`;
- `ENTREGA-PARA-OUTRA-IA.md`;
- `README.md`, salvo se desejado como documentação pública do repositório;
- arquivos de desenvolvimento, diagnósticos e materiais internos.

Como o workflow atual publica `path: .`, simplesmente deixar esses arquivos fora do HTML não os torna privados: eles continuam no artefato e podem ficar acessíveis por URL. O workflow deve passar a publicar uma pasta de distribuição com allowlist explícita, ou o repositório público deve conter somente os arquivos destinados à publicação.

## Arquivos que podem ir para o repositório privado

O repositório privado deve conter a fonte completa, documentação e operação interna:

- documentação de arquitetura e auditorias internas;
- prompts de desenvolvimento e materiais de avaliação;
- testes, ferramentas e scripts de validação;
- arquivos de planejamento;
- código futuro do backend;
- configurações de servidor;
- arquivos `.env` locais, apenas fora do Git ou em secret manager;
- integrações privadas, migrações, observabilidade e scripts administrativos;
- dados de teste não públicos, sem dados pessoais reais.

O repositório privado não deve receber automaticamente o histórico público contaminado por credenciais antigas. O ideal é criar a fonte privada a partir de um estado atual limpo, com novo histórico inicial, ou fazer uma limpeza controlada antes de criar os commits privados. A chave histórica Gemini já identificada deve ser revogada independentemente disso.

## O que continuará necessariamente visível no navegador

Mesmo com um repositório privado de fonte, tudo que for enviado ao navegador poderá ser inspecionado pelo usuário. Isso inclui:

- HTML, CSS e JavaScript do frontend;
- traduções e textos de interface;
- regras do prompt que continuarem dentro de `app.js`;
- nomes de endpoints e modelos usados pelo frontend;
- validações, limites, lógica de anexos, preview e downloads;
- política de privacidade;
- qualquer configuração incluída no bundle público.

Um repositório privado não transforma o código entregue ao navegador em código secreto. Ele protege a fonte e a documentação contra acesso direto ao GitHub, mas não esconde o bundle publicado.

## O que pode ser movido para um backend privado

Sem implementar agora, podem ser movidos para um backend privado:

- chave do Gemini;
- chamadas `fetch` para o Google;
- prompt de sistema e regras proprietárias;
- seleção privada de modelo e parâmetros;
- rate limit, autenticação, quotas e controles de abuso;
- pesquisa web, leitura de URLs e ferramentas futuras;
- validações e pipelines internos que não precisam ocorrer no dispositivo;
- logs operacionais redigidos e métricas agregadas.

Para isso, o frontend precisará trocar a chamada direta ao endpoint Google por uma chamada ao backend. Essa alteração é necessária para esconder a chave e o prompt de sistema, mas é uma mudança de arquitetura que deve ser implementada e testada separadamente.

## Arquitetura proposta

### Repositório privado de fonte

O repositório privado deve ser a fonte de verdade. Ele contém frontend completo, backend futuro, prompts, testes, documentação e configurações de desenvolvimento. Segredos reais devem ficar em GitHub Secrets, variáveis de ambiente ou secret manager, nunca em arquivos versionados.

Uma estrutura recomendada:

```text
brown-ia-private/
├── frontend/          # fonte do app web
├── backend/           # proxy Gemini futuro
├── prompts/            # prompts internos
├── tests/              # testes e validações
├── docs-private/      # arquitetura e auditorias internas
├── scripts/            # build e publicação
└── .github/workflows/  # CI privado e publicação controlada
```

### Repositório público de publicação

O repositório público atual deve permanecer como publicação enquanto a URL existente for necessária. Ele deve receber somente um artefato público construído:

```text
brown-ia-public/
├── index.html
├── styles.css
├── app.js
├── config.js
├── privacidade.html
└── .github/workflows/pages.yml
```

A publicação deve usar uma allowlist explícita. Não deve usar `path: .` a partir de um checkout que contenha documentação privada. O melhor fluxo é gerar `dist/` no repositório privado e publicar somente seu conteúdo no repositório público, ou publicar o artefato diretamente pelo mecanismo de Pages sem copiar a fonte privada.

## Ordem de migração sem downtime

1. **Congelar o estado público atual sem publicar alterações.** Registrar o commit e confirmar que a URL pública responde normalmente.
2. **Revogar a chave Gemini histórica** já identificada. Essa ação depende do proprietário e não deve ser automatizada neste plano.
3. **Criar o repositório privado de fonte a partir de uma cópia limpa do estado atual**, sem copiar a chave histórica nem arquivos de dados locais. Não reutilizar automaticamente todos os objetos Git antigos.
4. **Classificar cada arquivo** como fonte privada, artefato público ou documentação opcional.
5. **Criar uma build pública allowlisted** contendo apenas `index.html`, `styles.css`, `app.js`, `config.js`, `privacidade.html` e os arquivos necessários do Pages.
6. **Testar a build em uma pasta local** com servidor HTTP, sem publicá-la. Verificar links, carregamento, CSP, modo local, anexos, preview, downloads, idioma e persistência.
7. **Configurar o repositório público de publicação sem trocar sua visibilidade nem sua URL.** Nesta etapa futura, a alteração deverá ser revisada pelo proprietário antes do primeiro push.
8. **Publicar uma primeira versão equivalente**, sem remover funcionalidades do site atual. Verificar a URL pública e comparar a build antes e depois.
9. **Só depois da validação**, remover do repositório público os documentos internos e alterar o workflow para publicar a allowlist. Essa remoção não afeta o site se todos os arquivos necessários forem preservados.
10. **Migrar o Gemini para backend em uma etapa separada**, com fallback controlado ou manutenção temporária do BYOK para evitar indisponibilidade. Não remover o caminho antigo antes de testar o novo.

Durante a migração, o repositório público atual continua sendo o ponto de publicação. Assim, não é necessário trocar imediatamente a URL do Pages, desativar o Pages ou alterar a visibilidade.

## Testes necessários antes de qualquer troca

A build pública deve ser verificada localmente e, depois, em uma URL de prévia antes de substituir o artefato atual. Os testes mínimos são:

- HTTP 200 para `/`, `styles.css`, `app.js`, `config.js` e `privacidade.html`;
- ausência de `.env`, backups, auditorias, prompts internos, testes e documentos privados no artefato;
- ausência de chaves e tokens por varredura de padrões;
- carregamento sem erros JavaScript no navegador;
- modo local sem chave;
- envio Gemini somente em uma etapa que não use chave real de teste público;
- persistência e exclusão locais;
- alternância de idioma;
- anexos aceitos e rejeitados conforme limites;
- preview sandbox sem acesso ao contexto principal;
- download individual e ZIP;
- CSP e `Referrer-Policy` presentes;
- links de privacidade funcionando;
- responsividade em Android e desktop;
- teste de rollback com o artefato anterior.

## Rollback

O rollback deve ser simples e preparado antes da migração:

1. manter o último commit/artefato público conhecido como funcional;
2. não apagar o workflow nem os arquivos públicos antigos antes da validação;
3. se a nova build falhar, restaurar o artefato público anterior por um commit reversível;
4. confirmar HTTP 200, carregamento do HTML, assets e fluxo local;
5. não alterar visibilidade nem desativar Pages como tentativa de correção;
6. registrar o erro e corrigir no repositório privado antes de nova publicação.

Não se deve fazer force-push ou apagar branches como mecanismo de rollback.

## Riscos de exposição

O risco imediato é que o workflow atual publica a raiz inteira. Portanto, documentos internos existentes podem ser incluídos no artefato, mesmo que não sejam referenciados pelo HTML.

O histórico público também pode continuar contendo a chave Gemini antiga. Separar a fonte em outro repositório não remove a exposição do repositório público original.

O prompt de sistema atualmente embutido em `app.js` é necessariamente público enquanto a aplicação fizer a requisição Gemini diretamente do navegador. Para torná-lo privado, será preciso um backend.

O repositório privado protege a fonte, mas não protege dados enviados ao navegador, dados armazenados no `localStorage`, exportações do usuário ou conteúdo já enviado ao provedor Gemini.

## Ações que exigem confirmação posterior

Antes de executar qualquer migração real, será necessária confirmação explícita para:

- criar ou usar um novo repositório privado;
- criar ou alterar um repositório público de publicação;
- fazer commits ou push no repositório público;
- remover documentos internos da branch pública;
- alterar o workflow Pages;
- criar backend ou configurar infraestrutura externa;
- revogar a chave histórica;
- reescrever histórico ou fazer force-push;
- alterar domínio, URL, permissões ou colaboradores.

## Conclusão

A opção mais segura sem downtime é **manter o repositório atual público e o Pages ativo**, tratá-lo gradualmente como repositório público de publicação e criar separadamente um repositório privado com a fonte completa. O primeiro passo técnico da migração deve ser apenas criar uma cópia privada limpa e uma build pública allowlisted em ambiente local. Nenhuma dessas ações foi executada nesta análise.

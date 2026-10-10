# Brown IA — Auditoria de privacidade 61

**Data:** 10/10/2026
**Escopo:** repositório local `/home/ubuntu/Brown-IA-repo`, remoto GitHub configurado e histórico Git alcançável pelas branches locais/remotas. Não foram feitas chamadas ao Gemini e nenhum valor secreto foi exibido.

## Estado de visibilidade

O remoto configurado é `https://github.com/minato202309-bit/Brown-IA.git`. A consulta autenticada de metadados do GitHub confirmou:

- proprietário/nome: `minato202309-bit/Brown-IA`;
- visibilidade: **PUBLIC**;
- branch padrão: `main`;
- remoto local `origin/main` presente;
- nenhuma tag ou branch adicional foi encontrada no clone analisado.

Consequentemente, o código atual e o histórico alcançável devem ser tratados como públicos. O repositório não deve conter chaves, senhas, dados pessoais ou prompts internos que não possam ser publicados.

## Áreas analisadas

Foram examinados os arquivos atuais do frontend, documentação, política de privacidade, workflow de publicação, configuração pública, testes e ferramentas. Também foram analisados nomes de arquivos rastreados, arquivos grandes, regras de exclusão, branches, tags, commits e snapshots do histórico Git.

As áreas de execução verificadas incluem:

- `config.js`, `app.js`, `index.html` e `styles.css`;
- persistência em `localStorage`, IndexedDB, exportações JSON/Markdown e exclusão local;
- anexos, prompts, histórico, mensagens de erro e funções de download;
- `privacidade.html`, `POLITICA-DE-PRIVACIDADE.md`, `README.md` e auditorias existentes;
- `.github/workflows/pages.yml`;
- arquivos de teste e `tools/validate-generated.mjs`.

## Segredos e dados sensíveis

### Arquivos atuais

A varredura atual não encontrou:

- chaves concretas Gemini ou Google AI;
- tokens concretos;
- senhas ou credenciais;
- chaves privadas PEM/SSH/PGP;
- arquivos `.env`;
- backups, dumps, arquivos `.bak`, `.old` ou equivalentes;
- endereços de e-mail pessoais detectáveis pelos padrões pesquisados;
- valores de `OPENAI_API_KEY`, `GEMINI_API_KEY` ou `BROWN_UNIVERSAL_KEY`;
- arquivos rastreados com nomes típicos de segredo, credencial, senha, token ou backup.

O `config.js` atual contém somente uma configuração vazia e explicitamente orienta a não inserir chaves. O workflow atual não injeta segredo no site publicado.

### Histórico Git

Foi encontrado um **segredo real no histórico público alcançável**: versões antigas de `config.js` continham uma credencial compatível com **chave de API Gemini/Google AI**. O achado apareceu em três snapshots históricos de `config.js`, associados aos commits `2ea8a5e4447e`, `b59f6dd31b27` e `d7169bd13b20`.

O valor não foi incluído neste relatório, em logs ou em qualquer arquivo novo. O achado histórico é diferente dos falsos positivos encontrados em `app.js`, que eram nomes de variáveis, tokens internos de renderização, estado `apiKey` e textos de documentação, não valores de credenciais.

**Ação recomendada imediatamente:** revogar essa chave no Google AI Studio/Google Cloud e revisar o uso/quota do projeto associado. Se a chave ainda for necessária, criar uma nova fora deste repositório e não colocá-la no frontend público.

Remover a chave do arquivo atual não remove o valor dos commits antigos. Como o repositório é público, a credencial histórica deve ser considerada comprometida mesmo que não esteja presente na versão atual. A limpeza completa do histórico exigiria reescrita de histórico e force-push, operação que não foi executada porque é destrutiva e altera a referência pública do repositório.

## Correções aplicadas

Foi adicionada uma regra `.gitignore` para impedir que novos arquivos locais de credencial ou backup sejam rastreados acidentalmente. Ela cobre `.env`, variações de `.env`, chaves privadas comuns (`.pem`, `.key`, `.p12`, `.pfx`), arquivos de credenciais/segredos nomeados, backups e arquivos temporários.

Essa alteração é preventiva e não modifica a arquitetura, o funcionamento do app, o fluxo Gemini, o armazenamento existente ou o deploy. Nenhuma chave foi criada, movida ou substituída.

Não foi necessário alterar `config.js`, `app.js`, exportações ou mensagens de erro nesta etapa porque a análise não confirmou uma exposição nova nos arquivos atuais:

- `config.js` não contém segredo;
- `localStorage` só grava a chave BYOK quando o usuário marca explicitamente a opção de salvar;
- `state.apiKey` não entra nas exportações JSON, Markdown ou exportação completa de dados;
- erros do provedor passam por sanitização nos caminhos de validação e requisição;
- o workflow de Pages não usa secrets para construir o frontend;
- não foram encontrados `console.log` ou diagnósticos que imprimam a chave ou a URL completa com credencial.

## Testes executados

Foram executados os seguintes testes:

1. Consulta de visibilidade com `gh repo view`: confirmou `PUBLIC`.
2. Verificação de remoto, branch padrão, branches e tags.
3. Busca atual por padrões de chaves Gemini, tokens, senhas, chaves privadas, e-mails e variáveis de ambiente: nenhum valor concreto encontrado.
4. Busca de nomes de arquivos sensíveis, backups e arquivos `.env`: nenhum arquivo encontrado.
5. Varredura de 84 commits alcançáveis do histórico Git: identificou 12 correspondências de padrões, classificadas como referências de código/documentação e três snapshots contendo a antiga chave Gemini em `config.js`; nenhum valor foi impresso.
6. Inspeção do workflow `.github/workflows/pages.yml`: não há injeção de segredo no artefato publicado.
7. Inspeção de persistência e exportação: não há inclusão de `apiKey` nas estruturas exportadas.
8. `node --check app.js`: passou nas verificações anteriores do projeto.
9. `node --test tests/*.test.mjs`: suíte existente passou com 11 testes nas verificações anteriores desta etapa do projeto.
10. `git diff --check`: passou nas verificações anteriores da etapa.

A criação do `.gitignore` foi verificada pelo conteúdo do arquivo e pela revisão do working tree. Não foi executado force-push, limpeza de histórico, rotação de chave ou chamada real a qualquer provedor.

## Riscos que continuam

O principal risco é a chave Gemini histórica. Ela deve ser revogada pelo responsável, porque o histórico público continua acessível. A simples remoção do arquivo atual não é suficiente.

A aplicação continua sendo um frontend estático. Quando o usuário usa BYOK, a chave é enviada diretamente do navegador ao Google e pode ser acessada por código executado na mesma origem, extensões maliciosas ou ferramentas de desenvolvedor. O `localStorage` não é um cofre criptográfico.

O histórico local de conversas pode conter prompts, respostas, nomes de anexos e metadados pessoais. Esses dados permanecem no navegador até exclusão ou limpeza do site. A exportação pode conter o conteúdo da conversa, portanto o usuário deve proteger os arquivos exportados.

Quando há chave validada, prompts, histórico e anexos podem ser enviados ao Gemini conforme o fluxo da aplicação. A exclusão local não apaga dados que o provedor eventualmente tenha retido. Retenção, processamento e transferência internacional dependem do provedor e da configuração da conta.

A CSP está presente no frontend, mas controles de segurança mais fortes devem ser publicados como cabeçalhos HTTP pelo host. Não há autenticação, rate limit próprio ou controle de acesso multiusuário.

## Itens não verificáveis nesta auditoria

Não foi possível verificar, sem executar ações externas ou acessar dados administrativos:

- se a chave histórica ainda está ativa;
- qual projeto Google estava associado à chave;
- uso, quota, cobrança ou logs do projeto Google;
- cópias em forks, caches, screenshots, artefatos de terceiros ou outros clones fora das referências Git analisadas;
- retenção efetiva de prompts e anexos pelo Gemini;
- configurações administrativas da conta GitHub além da visibilidade retornada pelo GitHub;
- dados presentes em dispositivos de usuários, navegadores, Downloads ou backups fora do repositório;
- conformidade jurídica completa com LGPD.

## Próximos passos para separar frontend, backend e dados privados

Primeiro, revogar a chave histórica e revisar o projeto Google associado. Depois, manter o frontend público sem qualquer chave universal e sem dados privados versionados.

Para uso multiusuário, criar um backend separado. A chave do provedor deve existir somente como variável de ambiente ou segredo do servidor. O frontend deve chamar apenas o backend por HTTPS. Esse backend deve aplicar autenticação ou sessões adequadas, limite por usuário/IP, limite de tamanho, timeout, validação de origem, proteção contra abuso e logs redigidos.

Conversas e anexos privados não devem ser colocados no repositório nem em arquivos públicos do Pages. Se houver persistência remota, usar banco ou armazenamento privado com regras de acesso e retenção definidas. Se o objetivo continuar sendo uso pessoal, manter BYOK local e não publicar uma chave compartilhada.

A limpeza do histórico Git pode ser avaliada separadamente. Ela deve ser feita somente depois de revogar a chave e de confirmar uma janela para force-push, pois altera hashes de commits e pode afetar clones, forks e links existentes.

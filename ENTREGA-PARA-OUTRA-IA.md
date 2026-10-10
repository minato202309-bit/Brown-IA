# Brown-IA — pacote de continuidade

## Objetivo

Este pacote contém a versão atual da Brown-IA, uma aplicação web estática publicada no GitHub Pages. A aplicação usa HTML, CSS e JavaScript vanilla e pode conectar-se diretamente à API Gemini mediante chave fornecida pelo usuário.

## Arquivos principais

- `index.html` — estrutura da interface, menu, conversas, configurações, anexos e compositor.
- `app.js` — estado, conversas, persistência, Gemini, visão, geração de arquivos, links e ações por mensagem.
- `styles.css` — identidade visual escura hacker profissional, responsividade e componentes.
- `config.js` — configuração pública vazia. Não há chave universal nem injeção de segredo no workflow; use BYOK com consentimento ou backend seguro.
- `.github/workflows/pages.yml` — publicação no GitHub Pages.

## Funcionalidades já implementadas

- Perfis Brown e Code.
- Níveis Leve, Médio, Alto e Extremo.
- Português, inglês e espanhol.
- Memória local de mensagens, conversas, projetos, idioma, perfil e raciocínio.
- Persistência de arquivos recentes via IndexedDB.
- Upload de documentos, código, PDFs, imagens e outros arquivos.
- Envio de imagens ao Gemini usando `inlineData`.
- Prompt visual conservador com inventário, cores, texto e incertezas.
- Geração de arquivos a partir de blocos de código.
- Download individual de HTML, CSS, JS, JSON, Python, SVG, Markdown, TXT, YAML e Shell.
- Empacotamento de vários arquivos em ZIP real no navegador.
- Links isolados destacados na resposta.
- Copiar, editar, baixar Markdown, avaliar positivamente e avaliar negativamente cada mensagem.
- Restauração da conversa ativa após recarregar.
- Alternância entre conversas.
- Criação de nova conversa com ID único.
- Exclusão de conversas.
- Tolerância a `localStorage` corrompido ou indisponível.
- Validação de `chatId`.

## Restrições importantes

1. Não remova funcionalidades existentes sem explicar exatamente o motivo.
2. Não embuta nenhuma chave Gemini em `config.js`, `index.html`, `app.js`, `styles.css` ou no workflow.
3. Não substitua o Gemini por respostas prontas ou simulações locais quando houver uma chave validada.
4. Não transforme pedidos de jogos em apenas layouts ou backgrounds.
5. Não invente que um arquivo foi salvo se ele não foi gerado e disponibilizado para download.
6. Preserve os nomes Brown e Code; não reintroduza Vesper, Gmini ou nomes antigos.
7. Preserve o visual atual, salvo se uma alteração visual for solicitada explicitamente.
8. Ao alterar código, devolva arquivos completos e não trechos truncados.
9. Antes de concluir, rode `node --check app.js` e verifique o fluxo afetado.
10. Não publique credenciais. Se uma chave for necessária para teste, use apenas variável de ambiente ou entrada local não versionada.

## Testes já executados

Os seguintes fluxos foram executados em Chromium real:

- recarregar e restaurar a conversa ativa;
- alternar entre duas conversas e preservar seus históricos;
- criar uma nova conversa com ID diferente;
- excluir uma conversa e remover seu registro persistido;
- carregar `localStorage` com JSON inválido sem quebrar a aplicação.

Resultado: todos passaram.

## Próximas melhorias recomendadas

- Separar o estado/persistência em um módulo próprio sem alterar o comportamento.
- Criar testes automatizados de navegador para conversas, anexos e geração de arquivos.
- Adicionar um backend seguro se a aplicação for usada publicamente, evitando chave Gemini no navegador.
- Validar visualmente a análise de imagens com várias imagens reais antes de aumentar a confiança do recurso.
- Não trocar o modelo automaticamente sem confirmar suporte multimodal e limites da chave.

## Prompt para continuar o projeto

Você está recebendo o pacote atual da Brown-IA. Analise todos os arquivos antes de alterar qualquer coisa. Não reescreva o projeto do zero e não remova funcionalidades existentes.

Faça uma auditoria técnica do código real, separando:

1. defeitos confirmados;
2. riscos arquiteturais;
3. limitações do Gemini ou do navegador;
4. melhorias que podem ser aplicadas sem quebrar o comportamento atual.

Depois, se fizer alterações:

- preserve a interface Brown/Code e o tema hacker vermelho, branco e verde;
- preserve memória local, conversas, projetos, anexos, imagens, links, níveis de raciocínio e downloads;
- use IDs de conversa válidos e únicos;
- mantenha a exclusão de conversas sem referências inválidas;
- mantenha tratamento controlado para `localStorage` corrompido ou indisponível;
- faça a Brown seguir o pedido concreto do usuário;
- para jogos, gere implementação realmente jogável, com controles, regras, colisões, pontuação, vitória, derrota, reinício e suporte móvel;
- para imagens, liste objetos, cores, texto visível, posição e incertezas sem inventar detalhes;
- para arquivos, use blocos separados com `FILE: nome.ext` e entregue downloads completos;
- não coloque chaves de API nos arquivos.

Ao final, informe exatamente:

- arquivos alterados;
- motivo de cada alteração;
- comandos de validação executados;
- problemas ainda não resolvidos;
- como reproduzir cada teste importante.

Não diga apenas que está funcionando: mostre a evidência objetiva.

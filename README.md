# Brown-IA Web

Base web leve da Brown-IA. A versão atual é estática, responsiva e não exige servidor para abrir a interface. A conversa funciona em modo de demonstração local e também aceita uma chave temporária do Gemini somente em memória da aba.

## Estrutura

- `index.html` — estrutura da aplicação.
- `styles.css` — identidade visual vermelha, branca e verde.
- `app.js` — conversa local, memória da sessão, perfis, níveis de pensamento e exportação JSON.
- `docs/` — arquitetura e integração futura.

## Interface atual

A interface inclui os perfis Brown e Code, níveis Leve/Médio/Alto/Extremo, memória local, exportação de sessão, mensagens rápidas e seletor persistente de idioma da resposta: Automático, Português do Brasil, English e Español. A escolha fica salva no navegador quando a aplicação consegue usar armazenamento local.

## Executar localmente

Pode abrir `index.html` no navegador. Para uma execução local mais compatível:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

## Publicação estática

A aplicação não depende do GitHub em tempo de execução. O conteúdo pode ser publicado em qualquer hospedagem estática, incluindo Cloudflare Pages ou GitHub Pages. Nenhuma chave de API deve ser colocada em `app.js`.

### Chave temporária no navegador

O painel oferece um modo opcional **Bring Your Own Key**. A chave digitada fica apenas em memória por padrão; ela só é salva no `localStorage` quando o usuário marca explicitamente essa opção. Ela não é enviada para o repositório. Para uso público ou permanente, recomenda-se um backend seguro e uma chave restringida no Google AI Studio.

## Próximas fases

1. Conector backend seguro para Gemini.
2. Respostas por streaming e métricas reais.
3. Criação, validação e download de arquivos.
4. Pesquisa factual com fontes.
5. Anexos e sessões exportáveis.
6. Adaptadores para outros modelos.


## Privacidade e dados

A aplicação não carrega analytics, marketing, publicidade, pixels ou cookies opcionais. Ela registra a escolha do banner e as preferências no `localStorage`; isso não é um cookie HTTP. O menu de Configurações → Privacidade e dados permite ler a [política completa](privacidade.html), exportar os dados locais sem a chave BYOK, excluir conversas e apagar todos os dados locais.

A chave BYOK só é persistida quando o usuário marca explicitamente a opção de salvar. A aplicação envia prompts, histórico e anexos ao Gemini apenas quando uma chave validada é usada. A exclusão no navegador não apaga dados que o provedor possa ter retido. O controlador, o contato de privacidade e o encarregado ainda precisam ser preenchidos pelo responsável pelo serviço; veja `POLITICA-DE-PRIVACIDADE.md`.

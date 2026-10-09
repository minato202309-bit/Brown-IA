# Brown-IA Web

Base web leve da Brown-IA. A versão atual é estática, responsiva e não exige servidor para abrir a interface. A conversa funciona em modo de demonstração local e também aceita uma chave temporária do Gemini somente em memória da aba.

## Estrutura

- `index.html` — estrutura da aplicação.
- `styles.css` — identidade visual vermelha, branca e verde.
- `app.js` — conversa local, memória da sessão, perfis, níveis de pensamento e exportação JSON.
- `docs/` — arquitetura e integração futura.

## Interface atual

A interface inclui perfis GPT, CODE e GMINI, níveis Leve/Médio/Alto/Extremo, memória local, exportação de sessão, mensagens rápidas e seletor persistente de idioma da resposta: Automático, Português do Brasil, English e Español. A escolha fica salva no navegador.

## Executar localmente

Pode abrir `index.html` no navegador. Para uma execução local mais compatível:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

## Publicação estática

A aplicação não depende do GitHub em tempo de execução. O conteúdo pode ser publicado em qualquer hospedagem estática, incluindo Cloudflare Pages ou GitHub Pages. Nenhuma chave de API deve ser colocada em `app.js`.

### Chave temporária no navegador

O painel oferece um modo opcional **Bring Your Own Key**. A chave digitada é mantida apenas em memória, não é salva no `localStorage`, não é enviada para o repositório e desaparece ao recarregar a página. Para uso público ou permanente, recomenda-se um backend seguro e uma chave restringida no Google AI Studio.

## Próximas fases

1. Conector backend seguro para Gemini.
2. Respostas por streaming e métricas reais.
3. Criação, validação e download de arquivos.
4. Pesquisa factual com fontes.
5. Anexos e sessões exportáveis.
6. Adaptadores para outros modelos.

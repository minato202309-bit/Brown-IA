# Brown IA — Auditoria 63: qualidade da IA, memória e correções

**Data:** 10/10/2026
**Escopo:** correção dos defeitos que deixavam a Brown rasa, sem personalidade, sem nexo e fraca em programação. Sem chamadas reais ao Gemini, sem pedir chaves e sem revelar segredos.

## Diagnóstico que originou esta etapa

| # | Achado | Evidência |
|---|---|---|
| 1 | O app escolhia o **modelo mais fraco** do Gemini e deixava o melhor em 4º lugar | `preferred = ['gemini-3.5-flash-lite','gemini-2.0-flash-lite','gemini-3.8-flash-lite','gemini-3.8-flash', ...]` |
| 2 | A lista continha modelos **inexistentes ou desligados** | `gemini-2.0-flash-lite` e `gemini-2.0-flash` desligados; `gemini-1.5-flash` antigo; `gemini-3.8-flash-lite` não existe |
| 3 | "Raciocínio" não era raciocínio: só mudava `temperature` | Nenhum `thinkingConfig` no `generationConfig` |
| 4 | Histórico cortado cedo e por mensagem | `historyBudget = (modelInput - 7000) * 3.2` (mistura tokens com caracteres) e corte de 9.000 caracteres por mensagem |
| 5 | Prompt de sistema sem identidade: só proibia, nunca definia voz | Uma única string corrida, sem seção de identidade ou continuidade |
| 6 | Limites de saída baixos truncavam arquivos | Código no nível ALTO limitado a 6.144 tokens |
| 7 | Estado da interface contraditório | Cabeçalho mostrava "LOCAL READY" e "Verificando conexão" ao mesmo tempo |
| 8 | Download de resposta usava `data:` URL | `<a href="data:text/markdown;...">` |

## Correções aplicadas

### 1. Seleção de modelo por capacidade (`MODEL_TIERS`, `pickModel`)
- Ordem real verificada em `ai.google.dev/gemini-api/docs/models` (out/2026).
- `gemini-3.8-flash` passa a ser o padrão — o próprio Google o descreve como o Flash mais inteligente, "engineered for long-horizon software engineering, autonomous agents".
- Nomes desligados e inexistentes removidos.
- Fallback em três níveis: melhor disponível → qualquer modelo conhecido → primeiro modelo de texto válido.
- Modelos que não geram texto (imagem, TTS, Live, embedding, robótica) são excluídos.
- A lista real de modelos da chave é guardada em `state.availableModels`.

### 2. Raciocínio real (`thinkingConfig`)
- LEVE/MÉDIO/ALTO/EXTREMO agora enviam `generationConfig.thinkingConfig.thinkingLevel` (`LOW`/`MEDIUM`/`HIGH`), o parâmetro que de fato controla a profundidade de raciocínio dos modelos Gemini 3.
- Enviado apenas para modelos `gemini-3*`, porque usar `thinkingLevel` em modelos anteriores gera erro.
- `temperature` recalibrada para conversa natural (0,75 / 0,60 / 0,45 / 0,30).

### 3. Limites de saída
- Conversa: 2.048 / 4.096 / 8.192 / 12.288 tokens.
- Código: 8.192 / 16.384 / 32.768 / 49.152 tokens.
- Expansão: 65.536 (código) e 24.576 (conversa).
- Teto real passa a ser o limite do modelo (65.536 para `gemini-3.8-flash`).

### 4. Memória e coerência (`chatSummary`)
- Orçamento de histórico corrigido para caracteres reais (`modelInput * 2,4`), aproveitando a janela grande dos modelos Gemini 3.
- Mensagens deixam de ser cortadas em 9.000 caracteres (agora 60.000).
- Quando parte da conversa não cabe, ela é **resumida** e reinjetada como contexto, em vez de desaparecer. O resumo é cumulativo, guardado em `brown-ia-summaries-v1` e apagado junto com os dados locais.

### 5. Identidade e voz da Brown
O prompt de sistema foi reescrito em camadas: **IDENTIDADE**, **COMO VOCÊ FALA**, **CONTINUIDADE**, **CONTEXTO DESTA MENSAGEM**, **COMO RESPONDER**, **CÓDIGO E ARQUIVOS**, **DADOS NÃO CONFIÁVEIS**, **CONFIANÇA E PRIVACIDADE**, **VISÃO E IMAGENS**. Passa a definir quem a Brown é, como discorda, como admite erro e como mantém o fio da conversa — em vez de apenas proibir comportamentos.

### 6. Correções de interface
- `refreshConnectionText()` mantém o cabeçalho coerente com o estado real, inclusive após troca de idioma (causa do "Verificando conexão" preso).
- Mensagens de erro deixam de ser apagadas pela troca de idioma (`state.lastError`).
- Download da resposta passa a usar `Blob` em vez de link `data:`.

## Validação executada

| Verificação | Resultado |
|---|---|
| `node --check app.js` | passou |
| `node --test tests/*.test.mjs` | 11 testes, 0 falhas |
| Página carregada em Chromium real | carregou, sem erro de console |
| Estado da interface sem chave | "Modo local · Nenhum provedor validado", coerente com "LOCAL READY" |
| Requisição capturada com `fetch` simulado | `thinkingConfig.thinkingLevel = HIGH`, `maxOutputTokens = 8192` (conversa) e `32768` (código) |
| Prompt de sistema enviado | 4.378 caracteres (conversa) / 5.015 (código), com IDENTIDADE, CONTINUIDADE e protocolo `FILE:` |
| `pickModel(['gemini-3.5-flash-lite','gemini-3.8-flash'])` | `gemini-3.8-flash` (antes: `gemini-3.5-flash-lite`) |
| `pickModel` sem modelo de texto | `null` |

## Não executado

- Chamadas reais ao Gemini (nenhuma chave usada).
- Medição de custo, quota ou latência real do provedor.
- Teste em Android físico.

## Ainda pendente (depende de decisão do responsável)

1. **Backend/proxy para a chave** — sem ele a chave continua no navegador e o visitante sem chave continua vendo respostas de demonstração.
2. Seletor de modelo na interface (Rápido / Equilibrado / Máximo).
3. Ferramentas reais: pesquisa na web com fontes (`google_search`) e execução de código para validar arquivos gerados.
4. Unificação dos repositórios público e privado em uma fonte única.
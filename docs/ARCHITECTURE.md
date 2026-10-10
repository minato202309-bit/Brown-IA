# Arquitetura da Brown-IA Web

## Princípio

A interface não executa modelos pesados e não contém segredos. O frontend deve conversar com um contrato de provedor estável. O primeiro provedor planejado é um backend seguro para Gemini; futuros modelos poderão implementar o mesmo contrato.

```text
Browser
  ├── interface e estado local
  ├── localStorage para sessão, preferências e consentimento
  ├── IndexedDB opcional para limpeza futura de anexos
  └── Provider client
          ↓ HTTPS
Secure backend /api
          ↓
      GeminiProvider ou outro modelo
```

## Contrato planejado

`POST /api/chat`

```json
{
  "profile": "BROWN",
  "thinking": "MEDIO",
  "messages": [
    {"role": "user", "content": "Olá"}
  ],
  "attachments": []
}
```

Resposta final:

```json
{
  "content": "Resposta da Brown-IA",
  "files": [],
  "sources": [],
  "metrics": {
    "first_token_ms": 0,
    "total_ms": 0,
    "tokens_per_second": 0
  }
}
```

A chave do Gemini ficará somente no ambiente do backend. O navegador jamais receberá a chave.

## Perfis

- `BROWN`: conversa geral, análise, pesquisa e planejamento.
- `CODE`: programação, criação, validação e edição de arquivos.

## Níveis

- `LEVE`: resposta rápida.
- `MEDIO`: comportamento equilibrado.
- `ALTO`: análise e verificação ampliadas.
- `EXTREMO`: revisão rigorosa de requisitos e completude; não cria ferramentas que não existem.


## Privacidade e limites

O frontend não contém chave universal nem segredo de publicação. BYOK é mantida somente em memória por padrão ou no `localStorage` mediante consentimento explícito. A interface não carrega rastreadores opcionais e oferece exportação e exclusão locais. A política completa está em `POLITICA-DE-PRIVACIDADE.md` e a página navegável em `privacidade.html`.

A conexão direta com o Gemini permite que o provedor receba o conteúdo da solicitação e dos anexos; apagar o histórico local não controla a retenção de terceiros. Para um produto público, o contrato recomendado continua sendo um backend seguro, com autenticação, limites, rate limiting e chave mantida no servidor.

# Arquitetura da Brown-IA Web

## Princípio

A interface não executa modelos pesados e não contém segredos. O frontend deve conversar com um contrato de provedor estável. O primeiro provedor planejado é um backend seguro para Gemini; futuros modelos poderão implementar o mesmo contrato.

```text
Browser
  ├── interface e estado local
  ├── IndexedDB/localStorage para sessão
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
  "profile": "GPT",
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

- `GPT`: conversa geral e planejamento.
- `CODE`: programação, criação e edição de arquivos.
- `GMINI`: respostas rápidas e resumos.

## Níveis

- `LEVE`: resposta rápida.
- `MEDIO`: comportamento equilibrado.
- `ALTO`: análise e verificação ampliadas.
- `EXTREMO`: fluxo de planejamento, produção e revisão.

# Brown-IA — Auditoria 51: Segurança e privacidade

**Data:** 10 de outubro de 2026
**Escopo:** consentimento, privacidade, retenção, exclusão local, exportação e tráfego inicial da aplicação.

## Correções realizadas

1. **Política de privacidade completa:** adicionados `POLITICA-DE-PRIVACIDADE.md` e `privacidade.html`, com controlador, contato e encarregado explicitamente marcados como pendentes; dados tratados, finalidades, compartilhamento com Gemini, retenção, transferências internacionais, direitos LGPD, segurança e limitações.
2. **Banner de consentimento:** adicionados “Aceitar todos”, “Rejeitar não necessários” e “Personalizar”. O código não carrega cookies opcionais, analytics, marketing, pixels ou rastreadores; por isso as categorias não utilizadas permanecem desativadas em qualquer escolha.
3. **Revogação:** o painel de privacidade permite revogar a escolha e reabrir o banner.
4. **Controles do titular:** adicionados exportação de todos os dados locais sem a chave BYOK, exclusão de conversas/histórico, remoção da chave pelas configurações existentes e exclusão total dos dados locais.
5. **Exclusão total:** corrigido o ciclo de inicialização para não recriar automaticamente configurações ou consentimento após apagar todos os dados.
6. **Defesa contra prompt injection:** as instruções enviadas ao provedor identificam prompts, links, respostas e anexos como dados não confiáveis e rejeitam comandos inseridos neles que tentem alterar regras, revelar chaves ou acessar dados locais.
7. **Superfície de terceiros:** removida a importação remota de fontes do CSS. A página inicial agora carrega somente seus próprios assets antes de qualquer requisição ao Gemini.
8. **Persistência:** conversas vazias não são salvas como chats fantasma; a exclusão da conversa atual deixa o estado consistente.
9. **Documentação:** README e arquitetura atualizados; fontes oficiais registradas em `FONTES-PRIVACIDADE-51.md`.

## Testes executados

- `node --check app.js` — aprovado.
- `node --check config.js` — aprovado.
- `git diff --check` — aprovado.
- Varredura local de valores de credencial Gemini (`AIza...`/`AQ...`) fora dos padrões de sanitização e relatórios históricos — nenhuma credencial concreta encontrada.
- Chromium real, consentimento: banner inicial, rejeição, persistência após recarga, abertura de personalização, revogação e salvamento — aprovado.
- Chromium real, tráfego inicial: recursos carregados somente `styles.css`, `config.js` e `app.js`; nenhuma URL externa antes de envio ao provedor — aprovado.
- Chromium real, exportação: dados de conversa presentes, ausência de campo/valor da chave — aprovado.
- Chromium real, exclusão: todas as conversas removidas e exclusão total deixou `localStorage` vazio após recarga — aprovado.
- Chromium real em viewport móvel de 390×844: sem rolagem horizontal, banner dentro da tela, menu e rótulos acessíveis presentes — aprovado. Não foi executado um dispositivo Android físico nesta sessão.
- GitHub Pages: workflow do commit `27ff739` concluído com `success`; `index.html` público contém a versão de asset gerada pelo SHA e `privacidade.html` público contém a política — aprovado.

## Riscos e pendências honestas

- O controlador, CNPJ, endereço, canal de privacidade e encarregado ainda precisam ser preenchidos. Esta política não deve ser publicada como versão jurídica final sem essa revisão.
- BYOK no navegador não é um cofre. Um backend seguro é necessário para uso público, controle de quota e proteção de credenciais.
- A Brown-IA não consegue apagar logs ou cópias retidas pelo Google. A retenção depende do produto, projeto, quota, região e modalidade paga/não paga.
- Não foi afirmada conformidade LGPD, anonimato, criptografia ponta a ponta ou zero data retention.
- Não foi testado um aparelho Android físico nem feita uma revisão jurídica especializada.
- O código atual não implementa um backend de pesquisa web; links são tratados conforme o conteúdo disponível na requisição e a aplicação não deve afirmar que abriu uma página sem acesso real.

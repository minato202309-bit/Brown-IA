# Política de Privacidade e Proteção de Dados — Brown-IA

**Versão:** 10 de outubro de 2026  
**Status:** modelo operacional para completar pelo responsável pelo serviço; não constitui parecer jurídico nem declaração de conformidade.

## 1. Quem controla o tratamento

O controlador, a razão social, o CNPJ, o endereço e o contato oficial da Brown-IA **ainda não foram informados**. Esses campos devem ser preenchidos pelo responsável antes de apresentar esta política como documento final:

- **Controlador:** `[PREENCHER NOME OU RAZÃO SOCIAL]`
- **CNPJ ou identificador aplicável:** `[PREENCHER]`
- **Endereço:** `[PREENCHER]`
- **Contato de privacidade:** `[PREENCHER E-MAIL OU CANAL]`
- **Encarregado/DPO e contato:** `[PREENCHER OU INFORMAR A DISPENSA, SE APLICÁVEL]`

Não inventamos esses dados. A identidade e o contato do encarregado devem ser divulgados quando exigidos pelo regime aplicável; a LGPD prevê a divulgação pública dessas informações no art. 41. Consulte a avaliação jurídica do responsável para confirmar a aplicação e eventual dispensa.

## 2. Escopo e funcionamento

A Brown-IA é uma interface web estática. Ela pode funcionar em modo local ou enviar uma solicitação ao provedor Gemini quando o usuário configura e valida uma chave BYOK. O navegador não recebe uma chave universal da aplicação.

A interface não carrega, no código atual, analytics, pixel de marketing, publicidade, SDK de rastreamento ou cookie opcional. A escolha do banner de privacidade é registrada no `localStorage` do próprio navegador para que o banner não reapareça após a escolha. Isso é armazenamento local, não um cookie HTTP.

## 3. Dados que podem ser tratados

Dependendo do uso, o navegador pode armazenar localmente:

- mensagens enviadas e respostas recebidas;
- nomes, tamanhos e metadados de anexos; o conteúdo do anexo pode ser usado na solicitação, mas o aplicativo não promete manter seu conteúdo após a recarga;
- projetos, associações de conversas, perfil, idioma e nível de raciocínio;
- feedback de uma mensagem;
- consentimento de privacidade;
- a chave BYOK, **somente se o usuário marcar “Salvar neste navegador”**. Caso contrário, ela fica apenas na memória da aba e desaparece ao recarregar.

O aplicativo não pretende coletar nome, CPF, endereço, contatos ou dados de publicidade. O usuário pode, contudo, inserir essas informações em prompts ou arquivos. Por isso, não envie dados sensíveis, confidenciais, segredos, credenciais ou documentos de terceiros sem autorização e sem avaliar o risco.

O servidor de hospedagem e o provedor de internet podem ter logs próprios de acesso, como IP, data, user-agent e requisições. A Brown-IA não controla esses logs. A política do serviço de hospedagem deve ser identificada pelo controlador.

## 4. Finalidades

Os dados locais são usados para:

1. manter a conversa e permitir alternância entre chats;
2. restaurar preferências escolhidas no navegador;
3. enviar o pedido e os anexos ao provedor de IA quando o usuário solicita uma resposta conectada;
4. permitir exportação, download e exclusão solicitados pelo usuário;
5. corrigir erros, limitar arquivos e impedir envios duplicados dentro da interface.

Não há finalidade de marketing ou estatística no código atual.

## 5. O que é enviado ao provedor de IA

Quando há uma chave Gemini válida e o usuário envia uma mensagem, a Brown-IA pode enviar ao endpoint do Google:

- a mensagem atual;
- o histórico necessário da conversa;
- instruções de sistema para o comportamento da Brown;
- perfil, idioma e nível de raciocínio refletidos nessas instruções;
- conteúdo textual de TXT, CSV, Markdown, JSON, XML, HTML, CSS, JavaScript, TypeScript, Python e SVG;
- imagens e PDFs como dados binários no corpo da requisição;
- nome, MIME e tamanho do arquivo anexado.

A chave é enviada no cabeçalho da requisição ao endpoint, não é incluída na exportação de dados nem nos arquivos públicos do repositório. Ainda assim, uma chave usada diretamente no navegador pode ser extraída por código malicioso na mesma origem ou por inspeção do navegador. Para publicação pública, prefira um backend com controle de acesso, limites e segredo no servidor.

Conteúdo de anexos, links e respostas é tratado pelo modelo como dado não confiável. A interface adiciona instruções para não seguir comandos inseridos em documentos ou páginas como se fossem instruções do sistema. Essa defesa não substitui revisão humana nem uma arquitetura de backend.

## 6. Compartilhamento e provedores

O provedor Gemini é um terceiro necessário para respostas conectadas. A Brown-IA não afirma que o Google apaga prompts, respostas ou anexos quando o usuário apaga dados do navegador. A exclusão local **não exclui cópias, logs ou dados de segurança mantidos pelo provedor**.

Os termos da Gemini API diferenciam serviços pagos e não pagos. Nos serviços não pagos, os termos do Google informam que conteúdo enviado e respostas podem ser usados para fornecer, melhorar e desenvolver produtos e tecnologias, e que revisores humanos podem processar entradas e saídas em determinados contextos. Nos serviços pagos, os termos descrevem tratamento diferente, mas ainda podem existir logs limitados para segurança e exigências legais. A conta, o projeto, a região, o tipo de quota e a configuração do usuário precisam ser verificados antes de prometer tratamento específico.

**Regra prática:** não envie dados pessoais, sensíveis, confidenciais, proprietários ou segredos aos serviços gratuitos/não pagos. Verifique os termos vigentes do Google e o projeto utilizado.

Não são usados outros provedores, redes de publicidade ou ferramentas de analytics no código atual.

## 7. Transferências internacionais

O uso do Gemini pode envolver transferência ou acesso internacional de dados. O país, a entidade do Google, os subcontratados e o mecanismo jurídico aplicável dependem do produto, projeto, região, conta e modalidade de serviço. Essa informação **não pode ser determinada apenas pelo frontend atual** e deve ser preenchida e validada pelo controlador.

A ANPD regulamentou transferências internacionais pela Resolução CD/ANPD nº 19/2024, com mecanismos como decisões de adequação, cláusulas-padrão contratuais, cláusulas específicas e normas corporativas globais. O controlador deve documentar o mecanismo efetivamente utilizado e informar os titulares de forma adequada.

## 8. Armazenamento e retenção

### No navegador

As conversas, projetos, configurações e consentimentos permanecem no `localStorage` até que o usuário os exclua, limpe os dados do site ou use os controles da Brown-IA. A chave BYOK permanece somente enquanto a sessão estiver aberta, salvo se o usuário autorizar seu armazenamento local.

O aplicativo oferece:

- exclusão de conversas e histórico;
- remoção da chave BYOK;
- exportação dos dados locais, sem incluir a chave;
- exclusão de todos os dados locais, incluindo consentimento e configurações.

### No provedor

O aplicativo não define nem controla a retenção do Google. Termos, logs de segurança, abuse monitoring, File API, cache, grounding, modalidade paga/não paga e configurações do projeto podem alterar a retenção. Não prometemos anonimato, criptografia ponta a ponta, zero retenção ou exclusão de terceiros.

## 9. Cookies e tecnologias semelhantes

O código atual não usa cookies próprios opcionais. As categorias exibidas pelo banner são:

- **Necessários:** registro local da escolha de privacidade e funcionamento da aplicação;
- **Preferências:** nenhum cookie atualmente utilizado;
- **Estatísticas:** nenhum analytics atualmente utilizado;
- **Marketing:** nenhum rastreador atualmente utilizado.

“ Aceitar todos” não ativa rastreadores inexistentes. “Rejeitar não necessários” produz o mesmo efeito no código atual, pois só a categoria necessária é usada. “Personalizar” permite revisar essa informação. A escolha pode ser revogada em Configurações → Privacidade e dados.

Se uma futura versão adicionar analytics, publicidade, mapas, vídeos incorporados ou outros cookies, ela deverá atualizar esta política, separar as categorias e bloquear a tecnologia não necessária até consentimento válido.

## 10. Segurança

Medidas presentes no código:

- nenhuma chave universal no frontend ou no workflow;
- BYOK opcional e removível;
- erros da API limitados e com padrões de credenciais mascarados;
- escaping de HTML antes da renderização Markdown;
- links aceitos apenas com `http`/`https`, usando `noopener noreferrer`;
- limites para anexos e conteúdo textual;
- bloqueio de envios simultâneos;
- exportação sem a chave BYOK;
- nenhum log deliberado de chave, prompt ou conversa no código da aplicação.

Limitações importantes:

- `localStorage` não é um cofre criptográfico;
- qualquer script executado com acesso à origem pode ler dados locais;
- a chave BYOK no navegador não é adequada para uma aplicação pública sem backend;
- a conexão HTTPS protege o transporte quando disponível, mas não garante como o provedor trata o conteúdo após recebê-lo;
- segurança da hospedagem, navegador, dispositivo e extensões não é controlada pela Brown-IA.

## 11. Direitos do titular

Nos termos aplicáveis da LGPD, o titular pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio, eliminação quando cabível, portabilidade conforme regulamentação, informação sobre compartilhamentos, informação sobre consentimento e revogação do consentimento. O art. 18 da LGPD reúne esses direitos, observadas as exceções legais.

Na interface, o titular pode exportar e excluir dados armazenados neste navegador. Para um pedido formal ao controlador, envie:

- **Canal:** `[PREENCHER CONTATO OFICIAL]`;
- **Assunto:** “Solicitação LGPD — Brown-IA”;
- **Pedido:** acesso, correção, exclusão, revogação ou informação sobre compartilhamento;
- **Identificação mínima necessária:** `[O CONTROLADOR DEVE DEFINIR O PROCEDIMENTO]`.

Não envie uma chave de API ou dados sensíveis por e-mail. Caso o controlador não esteja identificado, esse fluxo ainda está pendente de preenchimento.

## 12. Crianças e adolescentes

Os termos atuais da Gemini API informam requisitos próprios de idade e uso profissional. A Brown-IA não concluiu uma avaliação específica de público infantil ou adolescente. O responsável deve definir o público, verificar os termos do provedor e implementar salvaguardas antes de disponibilizar o serviço a menores.

## 13. Alterações e contato

Esta política deve ser atualizada quando houver novo provedor, analytics, cookies, backend, finalidade, retenção, transferência ou mudança de controlador. A data, a versão e um resumo das alterações devem ser atualizados.

**Responsável por aprovar esta política:** `[PREENCHER]`  
**Última revisão técnica:** 10 de outubro de 2026  
**Contato de privacidade:** `[PREENCHER]`

## Referências oficiais

[1]: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/legislacao/lei-no-13-709-de-14-de-agosto-de-2018 "Lei Geral de Proteção de Dados Pessoais — LGPD"

[2]: https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf "Guia Orientativo Cookies e Proteção de Dados Pessoais — ANPD"

[3]: https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados "Transferência Internacional de Dados — ANPD"

[4]: https://ai.google.dev/gemini-api/terms "Gemini API Additional Terms of Service — Google"

[5]: https://ai.google.dev/gemini-api/docs/logs-policy "Data logging and sharing — Gemini API"

[6]: https://ai.google.dev/gemini-api/docs/zdr "Zero data retention in the Gemini Developer API — Google"

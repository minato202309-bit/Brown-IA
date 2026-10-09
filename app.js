const STORAGE_KEY = 'brown-ia-session-v1';
const state = { profile: 'GPT', thinking: 'MEDIO', messages: loadMessages(), startedAt: null };
const $ = (selector) => document.querySelector(selector);

function loadMessages() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages)); $('#messageCount').textContent = state.messages.length; }
function escapeText(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function renderMessages() {
  const root = $('#messages');
  if (!state.messages.length) { root.innerHTML = '<div class="empty-state" id="emptyState"><div class="empty-glyph">B/</div><h2>Conversa pronta.</h2><p>Envie uma pergunta, peça um plano ou descreva um arquivo que deseja criar.</p></div>'; persist(); return; }
  root.innerHTML = state.messages.map(m => `<article class="message ${m.role}"><div class="avatar">${m.role === 'user' ? 'OP' : 'B/'}</div><div class="message-body"><div class="message-label">${m.role === 'user' ? 'OPERADOR' : 'BROWN-IA · ' + state.profile}</div><div class="message-content">${escapeText(m.content)}</div></div></article>`).join('');
  root.scrollTop = root.scrollHeight; persist();
}
function localReply(input) {
  const text = input.toLowerCase().trim();
  if (/^(oi|olá|ola|e aí|e ai|bom dia|boa tarde|boa noite)[!. ]*$/.test(text)) return 'Olá. Estou pronta para ajudar. Descreva o que você precisa fazer.';
  if (/^tudo bem/.test(text)) return 'Tudo funcionando por aqui. Posso ajudar com conversa, código, pesquisa ou criação de arquivos.';
  if (text.includes('gemini')) return 'O conector Gemini ainda não está ativo nesta versão. A interface já está preparada para receber um backend seguro sem expor a chave no navegador.';
  if (text.includes('arquivo') || text.includes('html') || text.includes('código') || text.includes('codigo')) return 'Entendi o pedido. Nesta primeira versão, estou no modo de demonstração local. O próximo conector permitirá gerar, validar e baixar arquivos reais com confirmação do resultado.';
  return `Recebi sua mensagem no perfil ${state.profile}, com pensamento ${state.thinking.toLowerCase()}. O site está funcionando em modo local de demonstração; o próximo passo é conectar o provedor de IA sem colocar credenciais no frontend.`;
}
function updateTags() { $('#channelTitle').textContent = `Brown-IA · ${state.profile}`; $('#profileTag').textContent = state.profile; $('#thinkingTag').textContent = state.thinking; }
function setActive(selector, attr, value) { document.querySelectorAll(selector).forEach(el => el.classList.toggle('active', el.dataset[attr] === value)); }

$('#profileList').addEventListener('click', e => { const btn = e.target.closest('[data-profile]'); if (!btn) return; state.profile = btn.dataset.profile; setActive('.profile-btn','profile',state.profile); updateTags(); renderMessages(); });
$('#thinkingGrid').addEventListener('click', e => { const btn = e.target.closest('[data-thinking]'); if (!btn) return; state.thinking = btn.dataset.thinking; setActive('.thinking-btn','thinking',state.thinking); updateTags(); });
$('#clearBtn').addEventListener('click', () => { if (!state.messages.length || confirm('Limpar a sessão atual?')) { state.messages = []; renderMessages(); } });
$('#exportBtn').addEventListener('click', () => { const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), profile: state.profile, thinking: state.thinking, messages: state.messages }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `brown-ia-sessao-${Date.now()}.json`; a.click(); URL.revokeObjectURL(a.href); });
$('#settingsBtn').addEventListener('click', () => alert('Configurações avançadas serão adicionadas quando o backend seguro estiver conectado.'));
$('#composer').addEventListener('submit', async e => { e.preventDefault(); const input = $('#promptInput'); const content = input.value.trim(); if (!content) return; const started = performance.now(); state.messages.push({ role: 'user', content, at: new Date().toISOString() }); input.value = ''; renderMessages(); $('#statusText').textContent = 'PROCESSING'; $('#latencyLabel').textContent = 'processando'; await new Promise(resolve => setTimeout(resolve, 120)); state.messages.push({ role: 'assistant', content: localReply(content), at: new Date().toISOString() }); renderMessages(); const ms = ((performance.now() - started) / 1000).toFixed(1); $('#statusText').textContent = 'LOCAL READY'; $('#latencyLabel').textContent = `${ms}s · modo local`; });
$('#promptInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#composer').requestSubmit(); } });
updateTags(); renderMessages();

/*
 * SEND FLOW REAL — extraído diretamente do app.js
 *
 * Dependências existentes no app original:
 * state, $, fileReady, providerReady, MAX_PROMPT_CHARS, t,
 * appendMessageToChat, clearPendingFile, renderMessages,
 * geminiReply, localReply, isFileOnlyRequest, showQuotaFallback,
 * setConnectionStatus, validateMessageFiles e persist.
 */

function appendMessageToChat(chatId, message) { if (state.chatId === chatId) { state.messages.push(message); return; } const chat = state.chats.find(entry => entry.id === chatId); if (chat) { chat.messages = normalizeMessages([...(chat.messages || []), message]); chat.updatedAt = Date.now(); } }
$('#composer').addEventListener('submit', async e => {
  e.preventDefault(); if (state.busy) return; state.busy = true;
  const input = $('#promptInput'); const waitStarted = performance.now(); await Promise.all([fileReady, providerReady]);
  const content = input.value.trim(); if (!content && !state.pendingFile) { state.busy = false; return; }
  if (content.length > MAX_PROMPT_CHARS) { state.busy = false; const limitMessage = lang() === 'en' ? `The message exceeds the ${MAX_PROMPT_CHARS.toLocaleString('en-US')} character limit.` : lang() === 'es' ? `El mensaje supera el límite de ${MAX_PROMPT_CHARS.toLocaleString('es-ES')} caracteres.` : `A mensagem excede o limite de ${MAX_PROMPT_CHARS.toLocaleString('pt-BR')} caracteres.`; $('#latencyLabel').textContent = limitMessage; return; }
  state.lastRequestStatus = 'pending'; const requestId = ++state.requestSeq; const requestChatId = state.chatId; const started = performance.now(); const file = state.pendingFile; const messageText = content || t('filePrompt', file?.name || '');
  if (Number.isInteger(state.editingIndex)) { state.messages = state.messages.slice(0, state.editingIndex); state.editingIndex = null; }
  appendMessageToChat(requestChatId, { role: 'user', content: messageText, attachmentName: file?.name || '', at: new Date().toISOString() });
  appendMessageToChat(requestChatId, { role: 'assistant', content: '', fileOnly: isFileOnlyRequest(messageText), at: new Date().toISOString(), streaming: true });
  state.metrics = { uiPrepMs: performance.now() - waitStarted, ...(state.metrics || {}) };
  input.value = ''; clearPendingFile(); renderMessages(); $('#statusText').textContent = state.connection === 'ready' ? `${t('gemini')} ${t('processingStatus')}` : t('processingStatus'); $('#latencyLabel').textContent = t('processing');
  const sendButton = document.querySelector('.send-btn'); if (sendButton) sendButton.disabled = true;
  let renderQueued = false;
  const updateStreamingMessage = text => { if (requestId !== state.requestSeq) return; const target = state.messages[state.messages.length - 1]; if (!target || target.role !== 'assistant') return; target.content = text; target.streaming = true; if (!renderQueued) { renderQueued = true; requestAnimationFrame(() => { renderQueued = false; if (state.chatId === requestChatId) renderMessages(); }); } };
  try {
    const answer = state.apiKey ? await geminiReply(messageText, file, updateStreamingMessage) : await Promise.resolve(file ? t('localAttachment', file.name) : localReply(content));
    if (requestId !== state.requestSeq) return;
    const target = state.messages[state.messages.length - 1]; if (target?.role === 'assistant') { target.content = answer; delete target.streaming; } else appendMessageToChat(requestChatId, { role: 'assistant', content: answer, at: new Date().toISOString() });
    state.lastRequestStatus = 'success';
  } catch (error) {
    if (requestId !== state.requestSeq) return; const quotaError = /429|quota|rate limit|resource exhausted|limit exceeded/i.test(error.message); if (quotaError) showQuotaFallback(error.message); setConnectionStatus('error', quotaError ? t('providerUnavailable') : t('noProviderError')); state.lastRequestStatus = 'error'; const target = state.messages[state.messages.length - 1]; const errorText = `${t('errorProcess')}: ${error.message}`; if (target?.role === 'assistant') { target.content = errorText; delete target.streaming; } else appendMessageToChat(requestChatId, { role: 'assistant', content: errorText, at: new Date().toISOString() });
  } finally {
    if (requestId === state.requestSeq) { state.busy = false; if (sendButton) sendButton.disabled = false; if (state.connection === 'ready') $('#statusText').textContent = state.lastRequestStatus === 'error' ? t('geminiError') : t('geminiReady'); else if (state.connection !== 'error') $('#statusText').textContent = t('localReady'); state.metrics = { ...(state.metrics || {}), totalMs: performance.now() - started, renderMs: performance.now() - started }; window.__BROWN_LAST_METRICS__ = state.metrics; $('#latencyLabel').textContent = `${(state.metrics.totalMs / 1000).toFixed(1)}s`; if (state.chatId === requestChatId) { const responseIndex = state.messages.length - 1; renderMessages(); if (state.messages[responseIndex]?.role === 'assistant') validateMessageFiles(responseIndex); } else persist(); }
  }
});

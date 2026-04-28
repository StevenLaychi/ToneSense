'use strict';

const API = {
  analyze: '/api/analyze',
  rewrite: '/api/rewrite',
};

const TONE_COLORS = {
  'Profesional':       '#c8f135',
  'Professional':      '#c8f135',
  'Netral':            '#a0a0b0',
  'Neutral':           '#a0a0b0',
  'Defensif':          '#ffd95c',
  'Defensive':         '#ffd95c',
  'Pasif-Agresif':     '#ff8c5c',
  'Passive-Aggressive':'#ff8c5c',
  'Emosional':         '#ff5c5c',
  'Emotional':         '#ff5c5c',
  'Terlalu Santai':    '#5cb8ff',
  'Too Casual':        '#5cb8ff',
};

const RING_CIRCUMFERENCE = 2 * Math.PI * 26;

// ─── State ────────────────────────────────────────────────────────
const state = {
  language: 'id',
  mode: 'professional',
  lastText: '',
  isAnalyzed: false,
};

// ─── DOM Refs ─────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const els = {
  textInput:       $('text-input'),
  charCount:       $('char-count'),
  contextSelect:   $('context-select'),
  btnAnalyze:      $('btn-analyze'),
  btnRewrite:      $('btn-rewrite'),
  btnCopy:         $('btn-copy'),
  emptyState:      $('empty-state'),
  resultsContainer:$('results-container'),
  cardTone:        $('card-tone'),
  cardRisk:        $('card-risk'),
  cardRewrite:     $('card-rewrite'),
  toneName:        $('tone-name'),
  riskPill:        $('risk-pill'),
  tagSentiment:    $('tag-sentiment'),
  tagEmotion:      $('tag-emotion'),
  scoreVal:        $('score-val'),
  ringFill:        $('ring-fill'),
  confidenceBar:   $('confidence-bar'),
  confidenceVal:   $('confidence-val'),
  toneSummary:     $('tone-summary'),
  riskWords:       $('risk-words'),
  highlightedPreview: $('highlighted-preview'),
  colOriginalText: $('col-original-text'),
  colImprovedText: $('col-improved-text'),
  toast:           $('toast'),
};

// ─── Init ─────────────────────────────────────────────────────────
document.querySelectorAll('#lang-toggle .toggle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#lang-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.language = btn.dataset.value;
  });
});

document.querySelectorAll('#mode-list .mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mode-list .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.dataset.value;
  });
});

els.textInput.addEventListener('input', () => {
  els.charCount.textContent = els.textInput.value.length;
});

els.btnAnalyze.addEventListener('click', handleAnalyze);
els.btnRewrite.addEventListener('click', handleRewrite);
els.btnCopy.addEventListener('click', handleCopy);

// ─── Handlers ─────────────────────────────────────────────────────
async function handleAnalyze() {
  const text = els.textInput.value.trim();
  if (!text) { showToast('Please enter a message first.', true); return; }

  setButtonLoading(els.btnAnalyze, true, 'Analyzing...');

  try {
    const data = await post(API.analyze, {
      text,
      context: els.contextSelect.value,
      language: state.language,
    });

    state.lastText = text;
    state.isAnalyzed = true;

    renderToneCard(data);
    renderRiskCard(data, text);

    els.emptyState.style.display = 'none';
    els.resultsContainer.style.display = 'flex';
    els.cardRewrite.style.display = 'none';
    els.btnRewrite.disabled = false;

    showToast('Analysis complete.');
  } catch (err) {
    showToast(err.message, true);
  } finally {
    setButtonLoading(els.btnAnalyze, false, `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      Analyze Tone
    `);
  }
}

async function handleRewrite() {
  if (!state.lastText) { showToast('Analyze your text first.', true); return; }

  setButtonLoading(els.btnRewrite, true, 'Rewriting...');

  try {
    const data = await post(API.rewrite, {
      text: state.lastText,
      context: els.contextSelect.value,
      mode: state.mode,
      language: state.language,
    });

    renderRewriteCard(state.lastText, data.rewritten);
    showToast('Message rewritten successfully.');
  } catch (err) {
    showToast(err.message, true);
  } finally {
    setButtonLoading(els.btnRewrite, false, `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Rewrite Message
    `);
  }
}

function handleCopy() {
  const text = els.colImprovedText.textContent;
  navigator.clipboard.writeText(text).then(() => {
    els.btnCopy.classList.add('copied');
    els.btnCopy.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Copied!
    `;
    setTimeout(() => {
      els.btnCopy.classList.remove('copied');
      els.btnCopy.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy
      `;
    }, 2500);
  });
}

// ─── Render Functions ─────────────────────────────────────────────
function renderToneCard(data) {
  const color = TONE_COLORS[data.tone] || '#ededea';

  els.toneName.textContent = data.tone;
  els.toneName.style.color = color;

  els.riskPill.textContent = data.risk_level;
  els.riskPill.className = `risk-pill ${data.risk_level}`;

  els.tagSentiment.textContent = data.sentiment;
  els.tagEmotion.textContent = data.emotion;

  const riskPercent = Math.round(data.risk_score * 100);
  els.scoreVal.textContent = riskPercent;

  const offset = RING_CIRCUMFERENCE * (1 - data.risk_score);
  els.ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE;
  els.ringFill.style.stroke = color;
  setTimeout(() => { els.ringFill.style.strokeDashoffset = offset; }, 80);

  setTimeout(() => { els.confidenceBar.style.width = `${data.confidence}%`; }, 80);
  els.confidenceVal.textContent = `${data.confidence}%`;

  els.toneSummary.textContent = data.summary;
}

function renderRiskCard(data, originalText) {
  if (!data.risk_words || data.risk_words.length === 0) {
    els.cardRisk.style.display = 'none';
    return;
  }

  els.cardRisk.style.display = 'block';
  els.riskWords.innerHTML = data.risk_words.map((rw) => `
    <div class="risk-item">
      <span class="risk-word">"${escHtml(rw.word)}"</span>
      <span class="risk-reason">${escHtml(rw.reason)}</span>
    </div>
  `).join('');

  els.highlightedPreview.innerHTML = highlightWords(
    originalText,
    data.risk_words.map((r) => r.word)
  );
}

function renderRewriteCard(original, rewritten) {
  els.cardRewrite.style.display = 'block';
  els.colOriginalText.textContent = original;
  els.colImprovedText.textContent = rewritten;
  els.cardRewrite.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Helpers ──────────────────────────────────────────────────────
async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Something went wrong. Please try again.');
  }

  return json.data;
}

function setButtonLoading(btn, loading, labelHtml) {
  btn.disabled = loading;
  if (loading) {
    const text = btn.textContent.trim();
    btn.innerHTML = `<span class="spinner"></span> ${text.split(' ').slice(0,2).join(' ')}...`;
  } else {
    btn.innerHTML = labelHtml;
  }
}

function highlightWords(text, words) {
  let result = escHtml(text);
  words
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .forEach((word) => {
      const esc = escHtml(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${esc})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });
  return result;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
function showToast(message, isError = false) {
  els.toast.textContent = message;
  els.toast.className = `toast show${isError ? ' toast-error' : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { els.toast.className = 'toast'; }, 3500);
}

'use strict';

const GAUGE_CIRC = 2 * Math.PI * 48;

const TIPS = {
  id: [
    'Pilih konteks yang tepat agar hasil analisis lebih akurat.',
    'Tulis pesan seperti biasa, baru klik Analyze. Jangan filter diri sendiri dulu!',
    'Coba semua mode rewrite untuk lihat perbedaannya.',
    'Risk score di atas 0.6 artinya pesan berisiko merusak hubungan profesional.',
  ],
  en: [
    'Select the right context for more accurate analysis.',
    'Write your message naturally first, then analyze. Don\'t self-censor!',
    'Try all rewrite modes to see the differences.',
    'A risk score above 0.6 means the message could damage your professional relationship.',
  ],
};

const LANG_LABELS = {
  id: '🇮🇩 Bahasa Indonesia',
  en: '🇺🇸 English',
};

const PLACEHOLDERS = {
  id: 'Ketik atau paste pesanmu di sini...',
  en: 'Type or paste your message here...',
};

const TONE_COLORS = {
  'Profesional':'#a8ff57','Professional':'#a8ff57',
  'Netral':'#888','Neutral':'#888',
  'Defensif':'#ffd557','Defensive':'#ffd557',
  'Pasif-Agresif':'#ff8c57','Passive-Aggressive':'#ff8c57',
  'Emosional':'#ff5757','Emotional':'#ff5757',
  'Terlalu Santai':'#57c8ff','Too Casual':'#57c8ff',
};

// State
const st = { lang: 'id', context: 'lecturer_email', mode: 'professional', lastText: '', analyzed: false };

// DOM
const $ = id => document.getElementById(id);
const els = {
  textInput: $('text-input'), charCount: $('char-count'),
  btnAnalyze: $('btn-analyze'), btnRewrite: $('btn-rewrite'), btnClear: $('btn-clear'), btnCopy: $('btn-copy'),
  langBadge: $('lang-badge'), tipText: $('tip-text'),
  emptyScreen: $('empty-screen'), resultsWrap: $('results-wrap'),
  toneHeadline: $('tone-headline'), toneEyebrow: null,
  pillSentiment: $('pill-sentiment'), pillEmotion: $('pill-emotion'),
  toneSummary: $('tone-summary'),
  gaugeVal: $('gauge-val'), gaugeFill: $('gauge-fill'),
  riskBadge: $('risk-badge'), confFill: $('conf-fill'), confVal: $('conf-val'),
  cardRisks: $('card-risks'), riskChips: $('risk-chips'), previewBox: $('preview-box'),
  cardRewrite: $('card-rewrite'), originalBody: $('original-body'), improvedBody: $('improved-body'),
  rewriteCta: $('rewrite-cta'), ctaText: $('cta-text'),
  riskTitle: $('risk-title'), rewriteTitle: $('rewrite-title'),
  toast: $('toast'),
};

// ── Init ──────────────────────────────────────
document.querySelectorAll('#lang-toggle .lang-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#lang-toggle .lang-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    st.lang = btn.dataset.value;
    syncLang();
  });
});

document.querySelectorAll('#context-list .context-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#context-list .context-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    st.context = btn.dataset.value;
  });
});

document.querySelectorAll('#mode-list .mode-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mode-list .mode-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    st.mode = btn.dataset.value;
  });
});

els.textInput.addEventListener('input', () => {
  els.charCount.textContent = els.textInput.value.length;
});

els.btnClear.addEventListener('click', () => {
  els.textInput.value = '';
  els.charCount.textContent = '0';
  els.textInput.focus();
});

els.btnAnalyze.addEventListener('click', handleAnalyze);
els.btnRewrite.addEventListener('click', handleRewrite);
els.btnCopy.addEventListener('click', handleCopy);

// rotate tip every 6s
setInterval(rotateTip, 6000);
syncLang();

// ── Language sync ─────────────────────────────
function syncLang() {
  els.langBadge.textContent = LANG_LABELS[st.lang];
  els.textInput.placeholder = PLACEHOLDERS[st.lang];
  rotateTip();
}

let tipIdx = 0;
function rotateTip() {
  const tips = TIPS[st.lang];
  tipIdx = (tipIdx + 1) % tips.length;
  els.tipText.style.opacity = '0';
  setTimeout(() => { els.tipText.textContent = tips[tipIdx]; els.tipText.style.opacity = '1'; }, 200);
}

// ── Analyze ───────────────────────────────────
async function handleAnalyze() {
  const text = els.textInput.value.trim();
  if (!text) { showToast(st.lang === 'id' ? 'Masukkan teks terlebih dahulu.' : 'Please enter a message first.', true); return; }

  setLoading(els.btnAnalyze, true, st.lang === 'id' ? 'Menganalisis...' : 'Analyzing...');

  try {
    const data = await post('/api/analyze', { text, context: st.context, language: st.lang });
    st.lastText = text;
    st.analyzed = true;
    renderAnalysis(data, text);
    els.btnRewrite.disabled = false;
    showToast(st.lang === 'id' ? 'Analisis selesai!' : 'Analysis complete.');
  } catch (e) {
    showToast(e.message, true);
  } finally {
    setLoading(els.btnAnalyze, false, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> ${st.lang === 'id' ? 'Analyze Tone' : 'Analyze Tone'}`);
  }
}

// ── Rewrite ───────────────────────────────────
async function handleRewrite() {
  if (!st.lastText) { showToast(st.lang === 'id' ? 'Analisis teks terlebih dahulu.' : 'Analyze text first.', true); return; }

  setLoading(els.btnRewrite, true, st.lang === 'id' ? 'Menulis ulang...' : 'Rewriting...');

  try {
    const data = await post('/api/rewrite', { text: st.lastText, context: st.context, mode: st.mode, language: st.lang });
    renderRewrite(st.lastText, data.rewritten);
    showToast(st.lang === 'id' ? 'Selesai ditulis ulang!' : 'Message rewritten!');
  } catch (e) {
    showToast(e.message, true);
  } finally {
    setLoading(els.btnRewrite, false, `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> ${st.lang === 'id' ? 'Tulis Ulang' : 'Rewrite Message'}`);
  }
}

function handleCopy() {
  navigator.clipboard.writeText(els.improvedBody.textContent).then(() => {
    els.btnCopy.classList.add('copied');
    els.btnCopy.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    setTimeout(() => {
      els.btnCopy.classList.remove('copied');
      els.btnCopy.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
    }, 2500);
  });
}

// ── Render ────────────────────────────────────
function renderAnalysis(data, text) {
  els.emptyScreen.style.display = 'none';
  els.resultsWrap.style.display = 'flex';
  els.resultsWrap.style.flexDirection = 'column';
  els.resultsWrap.style.gap = '16px';
  els.cardRewrite.style.display = 'none';

  const color = TONE_COLORS[data.tone] || '#eeeef0';
  els.toneHeadline.textContent = data.tone;
  els.toneHeadline.style.color = color;
  els.pillSentiment.textContent = data.sentiment;
  els.pillEmotion.textContent = data.emotion;
  els.toneSummary.textContent = data.summary;

  const riskPct = Math.round(data.risk_score * 100);
  els.gaugeVal.textContent = riskPct;
  els.gaugeFill.style.stroke = color;
  const offset = GAUGE_CIRC * (1 - data.risk_score);
  els.gaugeFill.style.strokeDashoffset = GAUGE_CIRC;
  setTimeout(() => { els.gaugeFill.style.strokeDashoffset = offset; }, 80);

  els.riskBadge.textContent = data.risk_level;
  els.riskBadge.className = `risk-badge ${data.risk_level}`;

  setTimeout(() => { els.confFill.style.width = `${data.confidence}%`; }, 80);
  els.confVal.textContent = `${data.confidence}%`;

  if (data.risk_words && data.risk_words.length > 0) {
    els.cardRisks.style.display = 'block';
    els.riskTitle.textContent = st.lang === 'id' ? 'Frasa Berisiko' : 'Flagged Phrases';
    els.riskChips.innerHTML = data.risk_words.map(rw => `
      <div class="risk-chip">
        <span class="chip-word">"${esc(rw.word)}"</span>
        <span class="chip-reason">${esc(rw.reason)}</span>
      </div>
    `).join('');
    els.previewBox.innerHTML = highlight(text, data.risk_words.map(r => r.word));
  } else {
    els.cardRisks.style.display = 'none';
  }

  els.rewriteCta.style.display = 'flex';
  els.ctaText.textContent = st.lang === 'id'
    ? 'Siap ditulis ulang? Pilih mode dari sidebar.'
    : 'Ready to rewrite? Select a mode from the sidebar.';
}

function renderRewrite(original, rewritten) {
  els.cardRewrite.style.display = 'block';
  els.rewriteTitle.textContent = st.lang === 'id' ? 'Hasil Rewrite' : 'Rewritten Message';
  els.originalBody.textContent = original;
  els.improvedBody.textContent = rewritten;
  els.cardRewrite.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Helpers ───────────────────────────────────
async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong.');
  return json.data;
}

function setLoading(btn, loading, labelHtml) {
  btn.disabled = loading;
  if (loading) {
    const label = btn.textContent.trim().split('\n')[0].trim();
    btn.innerHTML = `<span class="spinner"></span> ${label}`;
  } else {
    btn.innerHTML = labelHtml;
  }
}

function highlight(text, words) {
  let r = esc(text);
  [...words].filter(Boolean).sort((a,b) => b.length - a.length).forEach(w => {
    const e = esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    r = r.replace(new RegExp(`(${e})`, 'gi'), '<mark>$1</mark>');
  });
  return r;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let toastTimer;
function showToast(msg, isErr = false) {
  els.toast.textContent = msg;
  els.toast.className = `toast show${isErr ? ' err' : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { els.toast.className = 'toast'; }, 3500);
}

const { CONTEXT_FORMALITY, REWRITE_MODE_INSTRUCTIONS, TONE_TYPES } = require('../config/constants');

function buildAnalysisPrompt(text, context, language) {
  const isEn = language === 'en';
  const toneOptions = isEn ? TONE_TYPES.EN.join(' / ') : TONE_TYPES.ID.join(' / ');
  const formalityGuide = CONTEXT_FORMALITY[context] || 'professional';

  if (isEn) {
    return `You are a senior communication psychologist and expert linguist specializing in professional communication analysis.

Your task: Analyze the tone, emotional risk, and communication quality of the following message.

---
MESSAGE: "${text}"
CONTEXT: The message will be sent as a ${context.replace(/_/g, ' ')}. Required formality level: ${formalityGuide}.
---

SCORING RUBRIC — be critical and precise:
- risk_score 0.0–0.29 → genuinely professional, clear, respectful, no red flags
- risk_score 0.30–0.59 → some friction: slightly informal, mild blame, ambiguous phrasing, or missed opportunity for warmth
- risk_score 0.60–0.79 → clear issues: direct blame, passive aggression, frustration leaking through, defensive framing
- risk_score 0.80–1.00 → high risk: hostile, aggressive, emotionally charged, relationship-damaging

DETECT THESE PATTERNS (flag all that apply):
- Absolute language: "always", "never", "every time", "nobody", "everyone"
- Direct blame: "you did", "your fault", "because of you"
- Passive aggression: "fine", "whatever", "as usual", "I guess", "if you say so"
- Dismissiveness: "obviously", "clearly", "you should know"
- Emotional leakage: frustration, resentment, sarcasm, exasperation
- Tone mismatch: too casual for the context, or overly stiff
- Missing elements: no greeting, no clear ask, no closing

Return ONLY a valid JSON object with no extra text or markdown:
{
  "tone": "one of: ${toneOptions}",
  "sentiment": "positive / negative / neutral",
  "emotion": "primary emotion (e.g. frustration, anxiety, anger, disappointment, sarcasm)",
  "risk_score": number 0.0 to 1.0 (two decimal places),
  "risk_level": "Low / Medium / High",
  "confidence": integer 0 to 100,
  "risk_words": [
    { "word": "exact word or phrase from the text", "reason": "specific explanation of why it is risky in this context" }
  ],
  "summary": "A sharp, honest 2-3 sentence analysis. Name the specific tone problems and explain the real-world impact if this message is sent as-is."
}`;
  }

  return `Kamu adalah psikolog komunikasi senior dan ahli linguistik profesional yang spesialis dalam analisis komunikasi tertulis.

Tugasmu: Analisis tone, risiko emosional, dan kualitas komunikasi dari pesan berikut secara mendalam dan jujur.

---
PESAN: "${text}"
KONTEKS: Pesan ini akan dikirim sebagai ${context.replace(/_/g, ' ')}. Tingkat formalitas yang dibutuhkan: ${formalityGuide}.
---

PANDUAN PENILAIAN — jadilah kritis dan presisi:
- risk_score 0.0–0.29 → benar-benar profesional, jelas, sopan, tidak ada masalah
- risk_score 0.30–0.59 → ada gesekan: sedikit informal, sedikit menyalahkan, frasa ambigu, atau kurang hangat
- risk_score 0.60–0.79 → masalah jelas: menyalahkan langsung, pasif-agresif, frustrasi terlihat, framing defensif
- risk_score 0.80–1.00 → risiko tinggi: hostile, agresif, muatan emosi tinggi, merusak hubungan

DETEKSI POLA BERIKUT (tandai semua yang ada):
- Bahasa absolut: "selalu", "tidak pernah", "setiap kali", "tidak ada yang", "semua orang"
- Menyalahkan langsung: "kamu yang salah", "gara-gara kamu", "kesalahanmu"
- Pasif-agresif: "terserah", "ya sudah", "seperti biasa", "kalau memang begitu"
- Meremehkan: "jelas sekali", "harusnya sudah tahu", "masa tidak tahu"
- Emosi bocor: frustrasi, kebencian, sarkasme, kelelahan emosional
- Tone tidak sesuai: terlalu santai untuk konteks, atau terlalu kaku
- Elemen hilang: tidak ada salam, tidak ada pertanyaan jelas, tidak ada penutup

Kembalikan HANYA objek JSON yang valid, tanpa teks tambahan atau markdown:
{
  "tone": "salah satu dari: ${toneOptions}",
  "sentiment": "positif / negatif / netral",
  "emotion": "emosi utama (contoh: frustrasi, cemas, marah, kecewa, sarkasme)",
  "risk_score": angka 0.0 sampai 1.0 (dua desimal),
  "risk_level": "Rendah / Sedang / Tinggi",
  "confidence": integer 0 sampai 100,
  "risk_words": [
    { "word": "kata atau frasa persis dari teks", "reason": "penjelasan spesifik kenapa berisiko dalam konteks ini" }
  ],
  "summary": "Analisis tajam dan jujur 2-3 kalimat. Sebutkan masalah tone spesifik dan jelaskan dampak nyata jika pesan ini dikirim apa adanya."
}`;
}

function buildRewritePrompt(text, context, mode, language) {
  const isEn = language === 'en';
  const modeInstruction = REWRITE_MODE_INSTRUCTIONS[mode]?.[isEn ? 'en' : 'id']
    || REWRITE_MODE_INSTRUCTIONS['professional'][isEn ? 'en' : 'id'];
  const formalityGuide = CONTEXT_FORMALITY[context] || 'professional';
  const contextLabel = context.replace(/_/g, ' ');

  if (isEn) {
    return `You are a master communication coach with 20 years of experience helping professionals communicate with precision and impact.

TASK: Rewrite the message below so it sounds ${modeInstruction}

---
ORIGINAL MESSAGE: "${text}"
RECIPIENT CONTEXT: ${contextLabel} — required formality: ${formalityGuide}
---

REWRITING RULES — follow all of them:
1. Preserve 100% of the original intent and core information — do not add or remove key points
2. Replace absolute language ("always", "never") with specific or softer alternatives ("on several occasions", "rarely")
3. Convert blame statements ("you did X") to observation statements ("it appears X happened" or "I noticed X")
4. Use "I" statements for feelings — never "you" accusations
5. Match the appropriate register for the recipient: ${contextLabel}
6. Sound like a real human wrote this — not a template or AI
7. Do NOT add hollow openers like "I hope this email finds you well" unless genuinely appropriate
8. Do NOT make it longer than necessary — every sentence must earn its place
9. If the context is a formal email (lecturer/manager/client), include an appropriate greeting and closing
10. The result must feel natural when read aloud

Return ONLY the rewritten message — no explanation, no labels, nothing else.`;
  }

  return `Kamu adalah communication coach terbaik dengan pengalaman 20 tahun membantu para profesional berkomunikasi dengan tepat dan berdampak.

TUGAS: Tulis ulang pesan berikut agar terdengar ${modeInstruction}

---
PESAN ASLI: "${text}"
KONTEKS PENERIMA: ${contextLabel} — formalitas yang dibutuhkan: ${formalityGuide}
---

ATURAN REWRITE — ikuti semua:
1. Pertahankan 100% maksud asli dan informasi inti — jangan tambah atau kurangi poin penting
2. Ganti bahasa absolut ("selalu", "tidak pernah") dengan alternatif yang spesifik atau lebih lembut ("beberapa kali", "jarang")
3. Ubah pernyataan menyalahkan ("kamu melakukan X") menjadi pernyataan observasi ("sepertinya X terjadi" atau "saya perhatikan X")
4. Gunakan kalimat "Saya" untuk mengungkapkan perasaan — jangan tuduhan "Kamu"
5. Sesuaikan register bahasa dengan penerima: ${contextLabel}
6. Terdengar seperti ditulis manusia sungguhan — bukan template atau AI
7. JANGAN tambahkan pembuka kosong seperti "Semoga email ini menemukan Anda dalam keadaan baik" kecuali benar-benar tepat
8. JANGAN lebih panjang dari yang dibutuhkan — setiap kalimat harus punya fungsi
9. Jika konteksnya email formal (dosen/atasan/klien), sertakan salam pembuka dan penutup yang sesuai
10. Hasilnya harus terasa natural saat dibaca keras

Kembalikan HANYA pesan hasil rewrite — tanpa penjelasan, tanpa label, tidak ada yang lain.`;
}

module.exports = { buildAnalysisPrompt, buildRewritePrompt };

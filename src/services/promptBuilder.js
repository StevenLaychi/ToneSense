const { CONTEXT_FORMALITY, REWRITE_MODE_INSTRUCTIONS, TONE_TYPES } = require('../config/constants');

function buildAnalysisPrompt(text, context, language) {
  const isEn = language === 'en';
  const toneOptions = isEn ? TONE_TYPES.EN.join(' / ') : TONE_TYPES.ID.join(' / ');
  const formalityGuide = CONTEXT_FORMALITY[context] || 'professional';

  if (isEn) {
    return `You are a senior communication psychologist and expert linguist.

CRITICAL LANGUAGE RULE: The user has selected ENGLISH mode. You MUST:
- Detect and analyze the message as English text only
- If the input appears to be in another language (e.g. Indonesian/Bahasa), still respond entirely in English
- All output fields (tone, sentiment, emotion, summary, risk_words reasons) MUST be written in English
- Never mix languages in your response

Your task: Analyze the tone, emotional risk, and communication quality of the following message.

---
MESSAGE: "${text}"
CONTEXT: This message will be sent as a ${context.replace(/_/g, ' ')}. Required formality level: ${formalityGuide}.
LANGUAGE: English — all analysis must be in English regardless of input language.
---

SCORING RUBRIC — be critical and precise:
- risk_score 0.0–0.29 → genuinely professional, clear, respectful, no red flags
- risk_score 0.30–0.59 → some friction: slightly informal, mild blame, ambiguous phrasing
- risk_score 0.60–0.79 → clear issues: direct blame, passive aggression, frustration leaking through
- risk_score 0.80–1.00 → high risk: hostile, aggressive, emotionally charged, relationship-damaging

DETECT THESE PATTERNS (flag all that apply):
- Absolute language: "always", "never", "every time", "nobody", "everyone"
- Direct blame: "you did", "your fault", "because of you"
- Passive aggression: "fine", "whatever", "as usual", "I guess"
- Dismissiveness: "obviously", "clearly", "you should know"
- Emotional leakage: frustration, resentment, sarcasm, exasperation
- Tone mismatch: too casual for the context, or overly stiff
- Missing elements: no greeting, no clear ask, no closing

Return ONLY a valid JSON object — no markdown, no extra text:
{
  "tone": "one of: ${toneOptions}",
  "sentiment": "positive / negative / neutral",
  "emotion": "primary emotion in English (e.g. frustration, anxiety, anger, disappointment)",
  "risk_score": number 0.0 to 1.0 (two decimal places),
  "risk_level": "Low / Medium / High",
  "confidence": integer 0 to 100,
  "risk_words": [
    { "word": "exact word or phrase from the text", "reason": "specific explanation in English" }
  ],
  "summary": "2-3 sentences in English. Name the specific tone problems and explain the real-world impact."
}`;
  }

  return `Kamu adalah psikolog komunikasi senior dan ahli linguistik profesional.

ATURAN BAHASA WAJIB: Pengguna telah memilih mode BAHASA INDONESIA. Kamu HARUS:
- Mendeteksi dan menganalisis pesan sebagai teks Bahasa Indonesia
- Jika input terlihat dalam bahasa lain (misalnya Inggris), tetap respons sepenuhnya dalam Bahasa Indonesia
- Semua field output (tone, sentiment, emotion, summary, alasan risk_words) WAJIB ditulis dalam Bahasa Indonesia
- Jangan pernah mencampur bahasa dalam respons

Tugasmu: Analisis tone, risiko emosional, dan kualitas komunikasi dari pesan berikut secara mendalam.

---
PESAN: "${text}"
KONTEKS: Pesan ini akan dikirim sebagai ${context.replace(/_/g, ' ')}. Tingkat formalitas: ${formalityGuide}.
BAHASA: Bahasa Indonesia — semua analisis harus dalam Bahasa Indonesia apapun bahasa inputnya.
---

PANDUAN PENILAIAN — jadilah kritis dan presisi:
- risk_score 0.0–0.29 → benar-benar profesional, jelas, sopan, tidak ada masalah
- risk_score 0.30–0.59 → ada gesekan: sedikit informal, sedikit menyalahkan, frasa ambigu
- risk_score 0.60–0.79 → masalah jelas: menyalahkan langsung, pasif-agresif, frustrasi terlihat
- risk_score 0.80–1.00 → risiko tinggi: hostile, agresif, muatan emosi tinggi, merusak hubungan

DETEKSI POLA BERIKUT (tandai semua yang ada):
- Bahasa absolut: "selalu", "tidak pernah", "setiap kali", "tidak ada yang", "semua orang"
- Menyalahkan langsung: "kamu yang salah", "gara-gara kamu", "kesalahanmu"
- Pasif-agresif: "terserah", "ya sudah", "seperti biasa", "kalau memang begitu"
- Meremehkan: "jelas sekali", "harusnya sudah tahu", "masa tidak tahu"
- Emosi bocor: frustrasi, kebencian, sarkasme, kelelahan emosional
- Tone tidak sesuai: terlalu santai untuk konteks, atau terlalu kaku
- Elemen hilang: tidak ada salam, tidak ada pertanyaan jelas, tidak ada penutup

Kembalikan HANYA objek JSON yang valid — tanpa markdown, tanpa teks tambahan:
{
  "tone": "salah satu dari: ${toneOptions}",
  "sentiment": "positif / negatif / netral",
  "emotion": "emosi utama dalam Bahasa Indonesia (contoh: frustrasi, cemas, marah, kecewa)",
  "risk_score": angka 0.0 sampai 1.0 (dua desimal),
  "risk_level": "Rendah / Sedang / Tinggi",
  "confidence": integer 0 sampai 100,
  "risk_words": [
    { "word": "kata atau frasa persis dari teks", "reason": "penjelasan spesifik dalam Bahasa Indonesia" }
  ],
  "summary": "2-3 kalimat dalam Bahasa Indonesia. Sebutkan masalah tone dan dampak nyatanya."
}`;
}

function buildRewritePrompt(text, context, mode, language) {
  const isEn = language === 'en';
  const modeInstruction = REWRITE_MODE_INSTRUCTIONS[mode]?.[isEn ? 'en' : 'id']
    || REWRITE_MODE_INSTRUCTIONS['professional'][isEn ? 'en' : 'id'];
  const formalityGuide = CONTEXT_FORMALITY[context] || 'professional';
  const contextLabel = context.replace(/_/g, ' ');

  if (isEn) {
    return `You are a master communication coach with 20 years of experience.

CRITICAL LANGUAGE RULE: The user has selected ENGLISH mode.
- You MUST rewrite the message in English only
- If the original message is in another language, still produce the rewrite in English
- Never output any Indonesian or other language in your response
- The entire rewritten message must be in English

TASK: Rewrite the message below so it sounds ${modeInstruction}

---
ORIGINAL MESSAGE: "${text}"
RECIPIENT CONTEXT: ${contextLabel} — required formality: ${formalityGuide}
OUTPUT LANGUAGE: English only — regardless of input language
---

REWRITING RULES:
1. Preserve 100% of the original intent
2. Replace absolute language ("always", "never") with softer alternatives
3. Convert blame ("you did X") to observation ("it appears X happened")
4. Use "I" statements for feelings — never "you" accusations
5. Match register for the recipient: ${contextLabel}
6. Sound like a real human — not a template or AI
7. Do NOT add hollow openers like "I hope this email finds you well"
8. Do NOT make it longer than necessary
9. If formal email context, include appropriate greeting and closing in English
10. Must feel natural when read aloud in English

Return ONLY the rewritten message in English — no explanation, no labels, nothing else.`;
  }

  return `Kamu adalah communication coach terbaik dengan pengalaman 20 tahun.

ATURAN BAHASA WAJIB: Pengguna telah memilih mode BAHASA INDONESIA.
- Kamu WAJIB menulis ulang pesan dalam Bahasa Indonesia saja
- Jika pesan asli dalam bahasa lain, tetap hasilkan rewrite dalam Bahasa Indonesia
- Jangan pernah menggunakan bahasa Inggris atau bahasa lain dalam output
- Seluruh pesan hasil rewrite harus dalam Bahasa Indonesia

TUGAS: Tulis ulang pesan berikut agar terdengar ${modeInstruction}

---
PESAN ASLI: "${text}"
KONTEKS PENERIMA: ${contextLabel} — formalitas yang dibutuhkan: ${formalityGuide}
BAHASA OUTPUT: Bahasa Indonesia saja — apapun bahasa inputnya
---

ATURAN REWRITE:
1. Pertahankan 100% maksud asli
2. Ganti bahasa absolut ("selalu", "tidak pernah") dengan alternatif lebih lembut
3. Ubah blame ("kamu melakukan X") jadi observasi ("sepertinya X terjadi")
4. Gunakan kalimat "Saya" — bukan tuduhan "Kamu"
5. Sesuaikan register dengan penerima: ${contextLabel}
6. Terdengar seperti ditulis manusia — bukan template atau AI
7. JANGAN tambah pembuka kosong yang tidak perlu
8. JANGAN lebih panjang dari yang dibutuhkan
9. Jika email formal (dosen/atasan/klien), sertakan salam dan penutup dalam Bahasa Indonesia
10. Harus terasa natural saat dibaca keras dalam Bahasa Indonesia

Kembalikan HANYA pesan hasil rewrite dalam Bahasa Indonesia — tanpa penjelasan, tanpa label.`;
}

module.exports = { buildAnalysisPrompt, buildRewritePrompt };

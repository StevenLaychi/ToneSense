const CONTEXTS = {
  LECTURER_EMAIL: 'lecturer_email',
  MANAGER_EMAIL: 'manager_email',
  COLLEAGUE_CHAT: 'colleague_chat',
  COMPLAINT: 'complaint',
  CLIENT_MESSAGE: 'client_message',
};

const CONTEXT_LABELS = {
  [CONTEXTS.LECTURER_EMAIL]: { id: 'Email ke Dosen', en: 'Email to Lecturer' },
  [CONTEXTS.MANAGER_EMAIL]: { id: 'Email ke Atasan', en: 'Email to Manager' },
  [CONTEXTS.COLLEAGUE_CHAT]: { id: 'Chat Rekan Kerja', en: 'Chat to Colleague' },
  [CONTEXTS.COMPLAINT]: { id: 'Komplain / Feedback', en: 'Complaint / Feedback' },
  [CONTEXTS.CLIENT_MESSAGE]: { id: 'Pesan ke Klien', en: 'Message to Client' },
};

const CONTEXT_FORMALITY = {
  [CONTEXTS.LECTURER_EMAIL]: 'very high — academic, respectful of expertise and seniority',
  [CONTEXTS.MANAGER_EMAIL]: 'high — professional hierarchy must be respected',
  [CONTEXTS.COLLEAGUE_CHAT]: 'medium — peer-level, friendly but still professional',
  [CONTEXTS.COMPLAINT]: 'medium-high — assertive but controlled and solution-focused',
  [CONTEXTS.CLIENT_MESSAGE]: 'high — represent the company, build trust and confidence',
};

const REWRITE_MODES = {
  PROFESSIONAL: 'professional',
  POLITE_FIRM: 'polite_firm',
  NEUTRAL: 'neutral',
  DEESCALATE: 'deescalate',
};

const REWRITE_MODE_INSTRUCTIONS = {
  [REWRITE_MODES.PROFESSIONAL]: {
    id: 'profesional dan formal. Gunakan struktur kalimat yang rapi, diksi yang tepat, dan nada yang mencerminkan kompetensi dan rasa hormat terhadap hierarki. Pesan harus terasa ditulis oleh seseorang yang percaya diri dan berpengalaman.',
    en: 'professional and formal. Use clear sentence structure, precise vocabulary, and a tone that reflects competence and respect for hierarchy. The message should feel written by a confident, experienced person.',
  },
  [REWRITE_MODES.POLITE_FIRM]: {
    id: 'sopan namun tegas. Sampaikan maksud dengan sangat jelas tanpa memohon atau menyerang. Tidak ada basa-basi berlebihan. Terdengar seperti dua orang dewasa yang setara sedang berkomunikasi.',
    en: 'polite but firm. State the point very clearly without over-apologizing or sounding aggressive. No unnecessary filler. Sound like two equal adults communicating.',
  },
  [REWRITE_MODES.NEUTRAL]: {
    id: 'netral dan berbasis fakta. Hilangkan semua muatan emosi. Fokus sepenuhnya pada situasi, data, dan solusi — bukan perasaan. Seperti laporan singkat yang objektif.',
    en: 'neutral and fact-based. Remove all emotional charge. Focus entirely on the situation, data, and solution — not feelings. Like a brief, objective report.',
  },
  [REWRITE_MODES.DEESCALATE]: {
    id: 'meredakan ketegangan. Tunjukkan empati yang tulus, akui perspektif lawan bicara, dan arahkan percakapan ke solusi bersama. Seperti seorang mediator yang bijak dan tenang.',
    en: 'de-escalating tension. Show genuine empathy, acknowledge the other perspective, and steer toward a shared solution. Like a calm, wise mediator.',
  },
};

const LANGUAGES = { ID: 'id', EN: 'en' };

const TONE_TYPES = {
  ID: ['Profesional', 'Netral', 'Defensif', 'Pasif-Agresif', 'Emosional', 'Terlalu Santai'],
  EN: ['Professional', 'Neutral', 'Defensive', 'Passive-Aggressive', 'Emotional', 'Too Casual'],
};

const RISK_LEVELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

module.exports = {
  CONTEXTS,
  CONTEXT_LABELS,
  CONTEXT_FORMALITY,
  REWRITE_MODES,
  REWRITE_MODE_INSTRUCTIONS,
  LANGUAGES,
  TONE_TYPES,
  RISK_LEVELS,
};

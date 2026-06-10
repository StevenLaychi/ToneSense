# ToneSense 
> AI-powered tone detection and rewrite assistant for professional communication

ToneSense helps students and professionals detect emotional risk in their written messages and rewrite them into a more appropriate tone — before hitting send.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![AI](https://img.shields.io/badge/AI-Llama%203.3%2070B-orange)

---

## The Problem

Most people send messages that unintentionally sound defensive, aggressive, or too casual for the context. Grammar checkers only fix spelling — not tone. ToneSense fills that gap.

**Example:**
> ❌ "Pak tugasnya tidak jelas. Saya sudah baca berkali-kali tapi tetap tidak mengerti. Tolong diperbaiki."

> ✅ "Yth. Bapak, saya ingin memohon penjelasan lebih lanjut mengenai instruksi tugas, karena saya mengalami kesulitan memahami beberapa bagiannya."

---

## Features

- **Tone Detection** — classifies tone as Professional, Defensive, Emotional, Passive-Aggressive, Neutral, or Too Casual
- **Risk Score** — rates emotional risk from 0 to 100 with confidence percentage
- **Risk Word Highlighting** — flags specific words or phrases with contextual explanations
- **Smart Rewrite** — rewrites your message in 4 modes:
  - 🟢 Professional Formal
  - 🔵 Polite but Firm
  - 🟡 Neutral Clarification
  - 🟠 De-escalation
- **Bilingual** — supports Bahasa Indonesia and English
- **Context-Aware** — adjusts analysis based on recipient (lecturer, manager, colleague, client, complaint)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Node.js + Express.js |
| AI Engine | Groq API — Llama 3.3 70B Versatile |
| Security | Helmet, CORS, express-rate-limit |

---

## Project Structure
tonesense/
├── src/
│   ├── app.js                      # Entry point
│   ├── config/
│   │   ├── env.js                  # Environment config & validation
│   │   ├── groq.js                 # Groq API client
│   │   └── constants.js            # App-wide constants
│   ├── controllers/
│   │   ├── analysisController.js
│   │   └── rewriteController.js
│   ├── middlewares/
│   │   ├── validate.js             # Input validation
│   │   └── errorHandler.js         # Centralized error handling
│   ├── routes/
│   │   ├── analysis.js
│   │   └── rewrite.js
│   ├── services/
│   │   ├── analysisService.js      # Analysis business logic
│   │   ├── rewriteService.js       # Rewrite business logic
│   │   └── promptBuilder.js        # AI prompt construction
│   └── utils/
│       ├── apiResponse.js
│       ├── logger.js
│       └── parseJson.js
└── public/
├── index.html
├── css/style.css
└── js/app.js

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/StevenLaychi/ToneSense.git
cd ToneSense
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root folder:
GROQ_API_KEY=gsk_your_key_here
PORT=3000
NODE_ENV=development

**4. Run the app**
```bash
node src/app.js
```

**5. Open in browser**
---

## API Reference

### POST /api/analyze
Analyzes the tone and emotional risk of a message.

**Request body:**
```json
{
  "text": "Your message here",
  "context": "lecturer_email | manager_email | colleague_chat | complaint | client_message",
  "language": "id | en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tone": "Defensif",
    "sentiment": "negatif",
    "emotion": "frustrasi",
    "risk_score": 0.74,
    "risk_level": "Tinggi",
    "confidence": 88,
    "risk_words": [
      { "word": "selalu", "reason": "generalisasi absolut yang terdengar menyalahkan" }
    ],
    "summary": "Pesan ini mengandung bahasa absolut dan framing yang defensif..."
  }
}
```

### POST /api/rewrite
Rewrites a message in the selected tone mode.

**Request body:**
```json
{
  "text": "Your message here",
  "context": "lecturer_email",
  "mode": "professional | polite_firm | neutral | deescalate",
  "language": "id | en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rewritten": "Yth. Bapak, saya ingin memohon penjelasan..."
  }
}
```

---

## Team

| Name | NIM | Role |
|------|-----|------|
| Steven Laychi | 2802457375 | Ketua / Backend Dev |
| Mika'il Giovanni Mofsol Muhammad | 2802548865 | Frontend Dev |
| Richie Vic Raymond | 2802551102 | QA & Dokumentasi |
| Samuel Paul Arthur Karuntu | 2802522090 | Analis |
| Daniel Hamonangan Sihombing | 2802509914 | Desainer |

---

## License

This project is developed as part of the Software Engineering course at Universitas Bina Nusantara.

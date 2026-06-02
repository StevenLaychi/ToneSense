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

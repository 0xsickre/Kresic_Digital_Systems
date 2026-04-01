# Pravni HTML (šabloni)

Ovde **menjaš** tekst u `*.html.example` fajlovima (lakše za paste iz editora).  
**Šta je u produkciji:** sadržaj iz šablona mora da bude u **`dictionaries/de.json` i `en.json`** polje `htmlBody` unutar `datenschutz` / `impressum` — to ide u git i Vercel vidi isto.

## Nakon izmene u `.example`

Iz korena projekta:

```bash
npm run sync:legal
```

Zatim commit `dictionaries/de.json` i `dictionaries/en.json`.

## Fajlovi

| Šablon (u gitu) |
|-----------------|
| `datenschutz.de.html.example` |
| `datenschutz.en.html.example` |
| `impressum.de.html.example` |
| `impressum.en.html.example` |

## Ponašanje ako `htmlBody` u rečniku je prazan

Stranica koristi ugrađeni tekst iz ostalih ključeva u `datenschutz` / `impressum` (stariji blok-paragrafi).

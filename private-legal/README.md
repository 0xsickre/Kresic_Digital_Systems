# Pravni HTML (šabloni)

Ovde **menjaš** tekst u `*.html.example` fajlovima (lakše za paste iz editora).  
**Šta je u produkciji:** sadržaj iz šablona mora da bude u **`dictionaries/de.json` i `en.json`** polje `htmlBody` unutar `datenschutz` / `impressum` / `widerruf` — to ide u git i Vercel vidi isto.

## Nakon izmene u `.example`

Iz korena projekta:

```bash
npm run sync:legal
npm run legal:pdf
```

Zatim commit `dictionaries/de.json`, `dictionaries/en.json` i `public/legal/*.pdf`.
PDF-ovi se generišu iz istog `htmlBody`, pa stranica i preuzimanje ne mogu da se raziđu.

## Fajlovi

| Šablon (u gitu) |
|-----------------|
| `datenschutz.de.html.example` |
| `datenschutz.en.html.example` |
| `impressum.de.html.example` |
| `impressum.en.html.example` |
| `widerruf.de.html.example` |
| `widerruf.en.html.example` |

## Ponašanje ako `htmlBody` u rečniku je prazan

Stranica koristi ugrađeni tekst iz ostalih ključeva u `datenschutz` / `impressum` (stariji blok-paragrafi).
`widerruf` nema taj fallback — tekst dolazi isključivo iz šablona.
